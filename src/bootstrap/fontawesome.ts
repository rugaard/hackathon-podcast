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
import { faSearch } from '@fortawesome/pro-regular-svg-icons/faSearch';
import { faXmark } from '@fortawesome/pro-regular-svg-icons/faXmark';

library.add(
  faBars,
  faChevronDown,
  faChevronLeft,
  faChevronRight,
  faChevronUp,
  faList,
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

library.add(
  faPauseSolid,
  faPauseCircleSolid,
  faPlaySolid,
  faPlayCircleSolid
);
