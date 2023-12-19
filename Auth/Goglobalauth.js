import axios from "axios";

class Goglobalauth {
  verify = false;
  url = "";
  app = "";
  // client
  async createApp(app_id, key, url) {
    try {
      const init = await axios({
        method: "post",
        url: url + "/app/init",
        data: {
          app_id,
          key,
        },
      });
      // console.log(init.data,"init")
      if (init.data.status) {
        this.url = url;
        this.verify = true;
        this.app = app_id;
      }
    } catch (error) {
      console.log(error);
      return error;
    }
  }
  async login(email, password) {
    try {
      const user = await axios({
        method: "post",
        url: this.url + "/auth/login",
        data: {
          email,
          password,
          app: this.app,
        },
      });
      if (user.data.status) {
        return {
          message: user.data.message,
          status: true,
          token: user.data.token,
          uid: user.data.user.user_id,
        };
      } else {
        return {
          message: user.data.message,
          status: false,
          token: null,
          uid: null,
        };
      }
    } catch (error) {
      // console.log(error)
      return {
        message: error.message,
        status: false,
      };
    }
  }
  async logout() {
    try {
      const user = await axios({
        method: "post",
        url: this.url + "/auth/logout",
      });

      // console.log(user)
      return {
        message: "Success!",
        status: true,
      };
    } catch (error) {
      console.log(error);
      return {
        message: error.message,
        status: false,
      };
    }
  }

  async forgortPassword(email, newPassword) {
    try {
      if (!this.verify) {
        return {
          message: "You not register yet!",
          status: false,
        };
      }
      // console.log("Password", email, newPassword);
      const forgortpassword = await axios({
        method: "post",
        url: this.url + "/users/forgortpassword",
        data: {
          newPassword,
          email,
          app: this.app,
        },
      });
      if (forgortpassword.data.status) {
        return {
          message: "ប្ដូរភ្លេចពាក្យសម្ងាត់ជោគជ័យ!!",
          status: true,
        };
      } else {
        return {
          message: forgortpassword.data.message,
          status: false,
        };
      }
    } catch (error) {
      return {
        message: error.message,
        status: false,
      };
    }
  }
}

export default Goglobalauth;
