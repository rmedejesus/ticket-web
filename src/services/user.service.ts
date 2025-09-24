import api from './api';

class UserService {
  getMe() {
    return api.get('/profile');
  }

  getUsers() {
    return api.get('/users');
  }
}

export default new UserService();