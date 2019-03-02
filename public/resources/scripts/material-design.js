import {MDCRipple} from '@material/ripple';
import {MDCTopAppBar} from '@material/top-app-bar/index';
import {MDCChipSet} from '@material/chips';
import {MDCSelect} from '@material/select';
import {MDCTextField} from '@material/textfield';
import {MDCTab} from '@material/tab';
import {MDCFormField} from '@material/form-field';
import {MDCRadio} from '@material/radio';
import {MDCList} from '@material/list';
import {MDCIconToggle} from '@material/icon-toggle';
import {MDCSnackbar} from '@material/snackbar';
import {MDCDialog} from '@material/dialog';

/* Instancias de Material Design Componentes for Web */
function componentesMDC() {
    //Instancias comunes
    const topAppBarElement = document.querySelector('.mdc-top-app-bar');
    const topAppBar = new MDCTopAppBar(topAppBarElement);
    const selector = '.mdc-button, mdc-icon-button, .mdc-card__primary-action';
    const ripples = [].map.call(document.querySelectorAll(selector), function(el) {  
        return new MDCRipple(el);
    });

    //Instancias de páginas especificas
    if(document.querySelector('.mdc-chip-set')) {
        const chipSetEl = document.querySelector('.mdc-chip-set');
        const chipSet = new MDCChipSet(chipSetEl);
    }

    if(document.querySelector('.mdc-select')) {
        const select = new MDCSelect(document.querySelector('.mdc-select'));
    }

    if (document.querySelector('.mdc-text-field')) {
        const textFields = [].map.call(document.querySelectorAll('.mdc-text-field'), function(el) {
            return new MDCTextField(el);
        });
    }

    if (document.querySelector('.mdc-tab')) {
        const tabs = [].map.call(document.querySelectorAll('.mdc-tab'), function(el) {
            return new MDCTab(el);
        });
    }

    if (document.querySelector('.mdc-radio')) {
        const radio = new MDCRadio(document.querySelector('.mdc-radio'));
        const formField = new MDCFormField(document.querySelector('.mdc-form-field'));
        formField.input = radio;
    }

    if (document.querySelector('.mdc-list')) {
        const list = new MDCList(document.querySelector('.mdc-list'));
        const listItemRipples = list.listElements.map((listItemEl) => new MDCRipple(listItemEl));
    }

    if (document.querySelector('.mdc-icon-button')) {
        const iconButtonRipple = new MDCRipple(document.querySelector('.mdc-icon-button'));
        iconButtonRipple.unbounded = true;
    }

    if (document.querySelector('.mdc-icon-toggle')) {
        MDCIconToggle.attachTo(document.querySelector('.mdc-icon-toggle'));
    }

    if (document.querySelector('.mdc-snackbar')) {
        const snackbar = new MDCSnackbar(document.querySelector('.mdc-snackbar'))
    }

    if(document.querySelector('.mdc-dialog')) {
        const dialog = new MDCDialog(document.querySelector('.mdc-dialog'));
    }
}

$(document).ready(function() {
    componentesMDC();
});