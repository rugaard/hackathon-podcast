import { library } from "@fortawesome/fontawesome-svg-core";

/**
 * Load icons from the "regular" style.
 */
import { faBars } from '@fortawesome/pro-regular-svg-icons/faBars';
import { faChevronDown } from '@fortawesome/pro-regular-svg-icons/faChevronDown';
import { faChevronLeft } from '@fortawesome/pro-regular-svg-icons/faChevronLeft';
import { faChevronRight } from '@fortawesome/pro-regular-svg-icons/faChevronRight';
import { faChevronUp } from '@fortawesome/pro-regular-svg-icons/faChevronUp';
import { faList } from '@fortawesome/pro-regular-svg-icons/faList';
import { faRotateLeft } from '@fortawesome/pro-regular-svg-icons/faRotateLeft';
import { faRotateRight } from '@fortawesome/pro-regular-svg-icons/faRotateRight';
import { faSearch } from '@fortawesome/pro-regular-svg-icons/faSearch';
import { faXmark } from '@fortawesome/pro-regular-svg-icons/faXmark';

library.add(
  faBars,
  faChevronDown,
  faChevronLeft,
  faChevronRight,
  faChevronUp,
  faList,
  faRotateLeft,
  faRotateRight,
  faSearch,
  faXmark
);

/**
 * Load icons from the "solid" style.
 */
import { faPause as faPauseSolid } from '@fortawesome/pro-solid-svg-icons/faPause';
import { faPauseCircle as faPauseCircleSolid } from '@fortawesome/pro-solid-svg-icons/faPauseCircle';
import { faPlay as faPlaySolid } from '@fortawesome/pro-solid-svg-icons/faPlay';
import { faPlayCircle as faPlayCircleSolid } from '@fortawesome/pro-solid-svg-icons/faPlayCircle';
import { faPowerOff as faPowerOffSolid } from '@fortawesome/pro-solid-svg-icons/faPowerOff';
import { faRotateLeft as faRotateLeftSolid } from '@fortawesome/pro-solid-svg-icons/faRotateLeft';
import { faRotateRight as faRotateRightSolid } from '@fortawesome/pro-solid-svg-icons/faRotateRight';

library.add(
  faPauseSolid,
  faPauseCircleSolid,
  faPlaySolid,
  faPlayCircleSolid,
  faPowerOffSolid,
  faRotateLeftSolid,
  faRotateRightSolid
);

/**
 * Load icons from the "duotone" style.
 */
import { faSpinnerThird as faSpinnerThirdDuo } from '@fortawesome/pro-duotone-svg-icons/faSpinnerThird';

library.add(
  faSpinnerThirdDuo
);
