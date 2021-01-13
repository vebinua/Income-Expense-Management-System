
export function HandleLogout() {

  //console.log('HandleLogout called!');

  localStorage.removeItem("access_token");
  localStorage.removeItem("expires_in");
  localStorage.removeItem("user_id");
  localStorage.removeItem("first_name");

}