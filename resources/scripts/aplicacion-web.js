import {MDCRipple} from '@material/ripple';
import {MDCTopAppBar} from '@material/top-app-bar/index';
import {MDCChipSet} from '@material/chips';
import {MDCSelect} from '@material/select';
import {MDCTextField} from '@material/textfield';

//Instancias comunes
const topAppBarElement = document.querySelector('.mdc-top-app-bar');
const topAppBar = new MDCTopAppBar(topAppBarElement);
const selector = '.mdc-button, .mdc-card__primary-action';
const ripples = [].map.call(document.querySelectorAll(selector), function(el) {  
    return new MDCRipple(el);
});

//Instancias de páginas especificas
if(document.querySelector('.mdc-chip-set')){
    const chipSetEl = document.querySelector('.mdc-chip-set');
    const chipSet = new MDCChipSet(chipSetEl);
}

if(document.querySelector('.mdc-select')){
    const select = new MDCSelect(document.querySelector('.mdc-select'));
}

if (document.querySelector('.mdc-text-field')){
    const textFields = [].map.call(document.querySelectorAll('.mdc-text-field'), function(el) {
        return new MDCTextField(el);
    });
}