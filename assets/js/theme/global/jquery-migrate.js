// From https://github.com/jquery/jquery-migrate/blob/master/src/event.js
// Needed because we use Foundation 5.5, which expects jQuery 2.x. However,
// rather than bringing in all of jquery-migrate, we're cherry picking individual
// fixes needed for Foundation.
//
// See https://stackoverflow.com/questions/37738732/jquery-3-0-url-indexof-error/37915907#37915907
//
/* eslint-disable prefer-rest-params */
jQuery.each(['load', 'unload', 'error'], (_, name) => {
    const oldLoad = jQuery.fn.load;

    jQuery.fn[name] = function handler() {
        const args = Array.prototype.slice.call(arguments, 0);

        // If this is an ajax load() the first arg should be the string URL;
        // technically this could also be the "Anything" arg of the event .load()
        // which just goes to show why this dumb signature has been deprecated!
        // jQuery custom builds that exclude the Ajax module justifiably die here.
        if (name === 'load' && typeof args[0] === 'string') {
            return oldLoad.apply(this, args);
        }

        args.splice(0, 0, name);
        if (arguments.length) {
            return this.on.apply(this, args);
        }

        // Use .triggerHandler here because:
        // - load and unload events don't need to bubble, only applied to window or image
        // - error event should not bubble to window, although it does pre-1.7
        // See http://bugs.jquery.com/ticket/11820
        this.triggerHandler.apply(this, args);
        return this;
    };
});
/* eslint-enable prefer-rest-params */
