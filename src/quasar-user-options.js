import './styles/quasar.sass';
import '@quasar/extras/roboto-font/roboto-font.css';
import '@quasar/extras/material-icons/material-icons.css';
import { Quasar, Loading, Dialog, BottomSheet } from 'quasar';

// To be used on app.use(Quasar, { ... })
export default {
  config: {
    loading: {
      /* look at QuasarConfOptions from the API card */
    },
    /*
     * Don't use brand color here.
     * Use quasar.variables.sass instead
     */
    // brand: {
    // }
  },
  plugins: {
    Loading,
    Dialog,
    BottomSheet,
  },
};
