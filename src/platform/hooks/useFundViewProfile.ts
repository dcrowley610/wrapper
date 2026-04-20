import { usePlatformContext } from '../context';
import { fundsService } from '../../modules/home/services/funds.service';

export function useFundViewProfile() {
  const { scopeSelection } = usePlatformContext();
  return fundsService.getFundViewProfile(scopeSelection);
}
