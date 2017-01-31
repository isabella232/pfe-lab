import React from 'react';

import { organizationShape, organizationCollaboratorsShape, organizationOwnerShape } from '../model';

const EditCollaborators = ({ organization, organizationOwner, organizationCollaborators, removeCollaborator, saving, updateCollaborator, user }) => {
  if (!organizationCollaborators || !organizationOwner) {
    return <div>Loading...</div>;
  }

  const POSSIBLE_ROLES = {
    collaborator: 'admin',
    scientist: 'scientist',
    moderator: 'moderator',
    tester: 'team',
  };

  const ROLES_INFO = {
    collaborator: {
      label: 'Collaborator',
      description: 'Collaborators have full access to edit organization content, including deleting the organization.',
    },
    scientist: {
      label: 'Researcher',
      description: 'Members of the research team will be marked as researchers on "Talk"',
    },
    moderator: {
      label: 'Moderator',
      description: 'Moderators have extra privileges in the community discussion area to moderate discussions. They will also be marked as moderators on "Talk".',
    },
    tester: {
      label: 'Tester',
      description: 'Testers can view (TODO: view what?). They cannot access the organization builder.',
    },
    translator: {
      label: 'Translator',
      description: 'Translators will have access to the translation site.',
    },
  };

  const toggleRole = (collaborator, event) => {
    updateCollaborator(collaborator, event.target.value, event.target.checked);
  };

  const handleRemoval = (collaborator) => {
    removeCollaborator(collaborator);
  };

  return (
    <div>
      <h3 className="form-label">Organization Owner</h3>
      <p>{(user.id === organizationOwner.id) ? 'You are the organization owner.' : `${organizationOwner.display_name} is the organization owner.`}</p>

      <br />

      <h3 className="form-label">Collaborators</h3>

      <hr />
      {organizationCollaborators.length === 1 &&
        <em className="form-help">None yet</em>}
      {organizationCollaborators.length > 1 &&
        (<ul>
          {organizationCollaborators.map((collaborator) => {
            return (<li key={collaborator.id}>
              <span>
                <strong>{collaborator.id}</strong>
                <button type="button" onClick={handleRemoval.bind(this, collaborator)}>&times;</button>
              </span>
              <br />
              <label>
                {Object.keys(POSSIBLE_ROLES).map((role, i) => {
                  return (
                    <span key={`role-${i}`}>
                      <input
                        type="checkbox"
                        name={role}
                        checked={collaborator.roles.includes(role)}
                        onChange={toggleRole.bind(this, collaborator)}
                        value={role}
                        disabled={saving === collaborator.id}
                      />
                      {ROLES_INFO[role].label}
                    </span>);
                })}
              </label>
            </li>);
          })}
        </ul>)}

      <hr />

      <div className="form-label">Add another</div>
    </div>
  );
};

EditCollaborators.propTypes = {
  organization: organizationShape,
  organizationCollaborators: organizationCollaboratorsShape,
  organizationOwner: organizationOwnerShape,
  removeCollaborator: React.PropTypes.func,
  saving: React.PropTypes.string,
  updateCollaborator: React.PropTypes.func,
  user: React.PropTypes.shape({
    id: React.PropTypes.string,
  }),
};

export default EditCollaborators;
