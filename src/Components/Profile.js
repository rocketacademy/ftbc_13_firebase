const Profile = (props) => {
  console.log(props);
  return (
    <div>
      <h3>{props.user.email}</h3>
      <h4>{props.user.uid}</h4>
    </div>
  );
};

export default Profile;
