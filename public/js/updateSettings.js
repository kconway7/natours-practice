import axios from 'axios';
import { showAlert } from './alerts';

// type is either password or data
export const updateSettings = async (data, type) => {
  try {
    const url =
      type === 'data'
        ? 'http://127.0.0.1:3000/api/v1/users/updateMe'
        : 'http://127.0.0.1:3000/api/v1/users/updateMyPassword';

    const res = await axios({
      method: 'PATCH',
      url,
      data,
    });

    location.reload(true);

    if (res.data.status === 'success') {
      showAlert('success', `${type === 'password' ? 'Password updated successfully' : 'Data updated succesfully'}`);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
    console.log(err);
  }
};
