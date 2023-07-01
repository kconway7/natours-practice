import axios from 'axios';
import { showAlert } from './alerts';

export const bookTour = async (tourId) => {
  const stripe = Stripe(
    'pk_test_51NIflXBw25ZdTWsgCL6kHtXkzUlUVhNJdQUWfg3de6KuXPG5vDAo73suNqFGiVwNNMfXJK56s6cRE6LtkKshkmyn00xbkXGHbL'
  );

  try {
    // 1) Get checkout session from API
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
    // console.log(session);

    // 2) Create checkout form + process + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
