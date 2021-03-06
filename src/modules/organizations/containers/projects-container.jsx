import React from 'react';
import { connect } from 'react-redux';
import { Paginator } from 'zooniverse-react-components';

import { projectsShape } from '../../projects/model';
import { organizationShape } from '../model';

import OrganizationProjectsList from '../components/organization-projects-list';
import OrganizationAddProject from '../components/organization-add-project';

import { setOrganizationProjects } from '../action-creators';
import notificationHandler from '../../../lib/notificationHandler';

class ProjectsContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      meta: null,
      projectToAdd: { value: '', label: '' },
      saving: null
    };

    this.addProject = this.addProject.bind(this);
    this.changeSelectedProject = this.changeSelectedProject.bind(this);
    this.getLinkedProjects = this.getLinkedProjects.bind(this);
    this.removeProject = this.removeProject.bind(this);
    this.resetProjectToAdd = this.resetProjectToAdd.bind(this);
  }

  componentDidMount() {
    this.getLinkedProjects();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.organization !== this.props.organization ||
      nextProps.location.query.page !== this.props.location.query.page) {
      this.getLinkedProjects(nextProps.organization, nextProps.location.query.page);
    }
  }

  componentWillUnmount() {
    this.props.dispatch(setOrganizationProjects([]));
  }

  getLinkedProjects(organization = this.props.organization, page = 1) {
    if (!organization || !organization.links.projects) {
      return;
    }

    const query = { sort: 'display_name', page };

    organization.get('projects', query)
      .then((projects) => {
        if (projects && projects.length > 0) {
          this.setState({ meta: projects[0].getMeta() });
          this.props.dispatch(setOrganizationProjects(projects));
        }
      })
      .catch((error) => {
        const notification = { status: 'critical', message: `${error.statusText}: ${error.message}` };
        notificationHandler(this.props.dispatch, notification);
      });
  }

  addProject() {
    const id = this.state.projectToAdd.value;

    this.props.organization.addLink('projects', [id])
      .then(() => {
        this.refreshProjects();
      })
      .then(() => {
        this.resetProjectToAdd();
      })
      .catch((error) => {
        const notification = { status: 'critical', message: `${error.statusText}: ${error.message}` };

        notificationHandler(this.props.dispatch, notification);
      });
  }

  removeProject(id) {
    this.setState({ saving: id });
    this.props.organization.removeLink('projects', [id])
      .then(() => {
        this.refreshProjects();
      })
      .then(() => {
        this.resetProjectToAdd();
        this.setState({ saving: null });
      })
      .catch((error) => {
        const notification = { status: 'critical', message: `${error.statusText}: ${error.message}` };

        notificationHandler(this.props.dispatch, notification);
      });
  }

  changeSelectedProject(selectedProject) {
    const projectToAdd = selectedProject || { value: '', label: '' };
    this.setState({ projectToAdd });
  }

  refreshProjects() {
    this.props.organization.uncacheLink('projects');
    this.getLinkedProjects();
  }

  resetProjectToAdd() {
    this.setState({ projectToAdd: { value: '', label: '' } });
  }

  render() {
    return (
      <div>
        <OrganizationProjectsList
          onRemove={this.removeProject}
          projects={this.props.organizationProjects}
        />
      {(this.props.organizationProjects.length > 0) && this.state.meta &&
          (<Paginator
            page={this.state.meta.page}
            pageCount={this.state.meta.page_count}
            router={this.props.router}
          />)
        }
        <hr />
        <OrganizationAddProject
          onAdd={this.addProject}
          onChange={this.changeSelectedProject}
          onReset={this.resetProjectToAdd}
          value={this.state.projectToAdd.value}
        />
      </div>
    );
  }
}

ProjectsContainer.defaultProps = {
  dispatch: () => {},
  location: {},
  organization: {},
  organizationProjects: [],
  router: {},
};

ProjectsContainer.propTypes = {
  dispatch: React.PropTypes.func,
  location: React.PropTypes.shape({
    query: React.PropTypes.shape({
      page: React.PropTypes.string,
    }),
  }),
  organization: organizationShape,
  organizationProjects: projectsShape,
  router: React.PropTypes.shape({
    push: React.PropTypes.func
  }),
};

function mapStateToProps(state) {
  return {
    organization: state.organization,
    organizationProjects: state.organizationProjects,
  };
}

export default connect(mapStateToProps)(ProjectsContainer);
