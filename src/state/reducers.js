import userReducer from './user/reducers';
import driveronlineReducer from './driveronline/reducers';
import zoneReducer from './zone/reducers';
import demandeReducer from './demande/reducers';
import walletReducer from './wallet/reducers';
import biddetailReducer from './biddetail/reducers';

export default ({ user, driveronline, zone, biddetail, demande, wallet }, action) => ({
  user: userReducer(user, action),
  driveronline: driveronlineReducer(driveronline, action),
  zone: zoneReducer(zone, action),
  demande: demandeReducer(demande, action),
  wallet: walletReducer(wallet, action),
  biddetail: biddetailReducer(biddetail, action)
});
