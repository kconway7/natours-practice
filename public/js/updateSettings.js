import axios from 'axios';
import { showAlert } from './alerts';

// type is either password or data
export const updateSettings = async (data, type) => {
  try {
    const url = type === 'data' ? '/api/v1/users/updateMe' : '/api/v1/users/updateMyPassword';

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
