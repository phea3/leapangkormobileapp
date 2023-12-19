import Goglobalauth from './Goglobalauth'
import serviceAccount from './keyService.json';

const auth = new Goglobalauth();
// client 
auth.createApp(serviceAccount.app_id, serviceAccount.key, serviceAccount.url)
export default auth;