import React from 'react';

import { Provider } from 'react-redux';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import store from './store';

import AppRouter from './routers/AppRouter';
import ConfirmModal from './components/ConfirmModal';

const App: React.FC = () => {
  return (
    <>
      <Provider store={store}>
        <AppRouter />
        <ConfirmModal />
        <ToastContainer position="bottom-center" autoClose={3000} />
      </Provider>
    </>
  );
};

export default App;
