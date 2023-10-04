const EditProfile = (props) => {
  return (
    <div>
      <h3>{props.user.email}</h3>
      <h4>{props.user.uuid}</h4>
      <input type="text" />
      <input type="text" />
    </div>
  );
};

export default EditProfile;
