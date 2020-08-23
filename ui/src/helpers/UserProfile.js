var UserProfile = (function () {
  var setSession = (uname, uemail, uid) => {
    var user = {
      name: "",
      email: "",
      user_id: "",
    };

    user.name = uname;
    user.email = uemail;
    user.user_id = uid;
    localStorage.setItem("user", JSON.stringify(user));
  };

  var getSession = () => {
    var user = localStorage.getItem("user");
    return user;
  };

  return {
    getSession: getSession,
    setSession: setSession,
  };
})();

export default UserProfile;
