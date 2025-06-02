class APIConstants {
  BASE_URL = "http://localhost:3000/api";

  // Controllers
  AUTH = this.BASE_URL + "/auth";
  USER = this.BASE_URL + "/user";
  EVENTS = this.BASE_URL + "/events";
  FORM = this.BASE_URL + "/form";
  PROJECTS = this.BASE_URL + "/projects";
  TEAM = this.BASE_URL + "/team";

  // Auth Endpoints
  LOGIN = this.AUTH + "/login";
  GOOGLE_LOGIN = this.AUTH + "/google";
  FORGOT_PASSWORD = this.AUTH + "/forgot-password";
  RESET_PASSWORD = this.AUTH + "/reset-password";
  SIGNUP = this.AUTH + "/signup";

  //Events Endpoints
  GET_ALL_EVENTS = this.EVENTS + "/";
  SEARCH_EVENTS = this.EVENTS + "/search";
  GET_EVENTS_BY_USER = this.EVENTS + "/user/user-events";
  ADD_EVENT = this.EVENTS + "/";
  GET_EVENT_BY_ID = (id: string) => `${this.EVENTS}/${id}`;
  EDIT_EVENT = (id: string) => `${this.EVENTS}/${id}`;
  DELETE_EVENT = (id: string) => `${this.EVENTS}/${id}`;

  //Project Endpoints
  GET_ROOT_PROJECTS = this.PROJECTS + "/";
  GET_PROJECT_BY_ID = (id: string) => `${this.PROJECTS}/${id}`;
  CREATE_PROJECT = this.PROJECTS + "/";
  EDIT_PROJECT = (id: string) => `${this.PROJECTS}/${id}`;
  GET_PROJECT_DETAILS = (id: string) => `${this.PROJECTS}/detail/${id}`;
  FILE_UPLOAD_PROJECT = (id: string) => `${this.PROJECTS}/uploadfile/${id}`;
  FILE_DELETE_PROJECT = (id: string) => `${this.PROJECTS}/deletefile/${id}`;
  //Form Endpoints
  GET_FORM_BY_EVENT = (id: string) => `${this.FORM}/${id}`;
  ADD_MANY_FORM = this.FORM + "/add/many";
  DELETE_FORM_BY_EVENT = (id: string) => `${this.FORM}/${id}`;
  REPLACE_FORM_BY_EVENT = (id: string) => `${this.FORM}/replace/${id}`;

  //Team Endpoints
  CREATE_TEAM = this.TEAM + "/create";
  GET_TEAMS = this.TEAM + "/";
  INVITE_TEAM = (teamId: string) => `${this.TEAM}/${teamId}/invite`;
}

const API_CONSTANTS = new APIConstants();
export default API_CONSTANTS;
