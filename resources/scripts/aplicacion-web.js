import {MDCRipple} from '@material/ripple';
import {MDCTopAppBar} from '@material/top-app-bar/index';
import {MDCChipSet} from '@material/chips';
import {MDCSelect} from '@material/select';

const topAppBarElement = document.querySelector('.mdc-top-app-bar');
const topAppBar = new MDCTopAppBar(topAppBarElement);

const chipSetEl = document.querySelector('.mdc-chip-set');
const chipSet = new MDCChipSet(chipSetEl);

const select = new MDCSelect(document.querySelector('.mdc-select'));

const selector = '.mdc-button, .mdc-card__primary-action';
const ripples = [].map.call(document.querySelectorAll(selector), function(el) {
  return new MDCRipple(el);
});