import userReducer from './user/reducers';
import driveronlineReducer from './driveronline/reducers';
import demandeReducer from './demande/reducers';
import walletReducer from './wallet/reducers';
import biddetailReducer from './biddetail/reducers';

export default ({ user, driveronline, biddetail, demande, wallet }, action) => ({
  user: userReducer(user, action),
  driveronline: driveronlineReducer(driveronline, action),
  demande: demandeReducer(demande, action),
  wallet: walletReducer(wallet, action),
  biddetail: biddetailReducer(biddetail, action)
});
