
export const ARROW_LEFT_EVENT_INIT: EventInit = {
    bubbles: true,
    cancelable: true,
    view: window,
    key: "ArrowLeft",
    keyCode: 37,
    which: 37,
    code: "ArrowLeft",
    location: 0,
    altKey: false,
    ctrlKey: false,
    metaKey: false,
    shiftKey: false,
    repeat: false,
} as EventInit;


export const ARROW_UP_EVENT_INIT: EventInit = {
    bubbles: true,
    cancelable: true,
    view: window,
    key: "ArrowUp",
    keyCode: 38,
    which: 38,
    code: "ArrowUp",
    location: 0,
    altKey: false,
    ctrlKey: false,
    metaKey: false,
    shiftKey: false,
    repeat: false,
} as EventInit;

export const ARROWRIGHT_EVENT_INIT: EventInit = {
    bubbles: true,
    cancelable: true,
    view: window,
    key: "ArrowRight",
    keyCode: 39,
    which: 39,
    code: "ArrowRight",
    location: 0,
    altKey: false,
    ctrlKey: false,
    metaKey: false,
    shiftKey: false,
    repeat: false,
} as EventInit;

export const ARROW_DOWN_EVENT_INIT: EventInit = {
    bubbles: true,
    cancelable: true,
    view: window,
    key: "ArrowDown",
    keyCode: 40,
    which: 40,
    code: "ArrowDown",
    location: 0,
    altKey: false,
    ctrlKey: false,
    metaKey: false,
    shiftKey: false,
    repeat: false,
} as EventInit;

export const TOOLBAR_FOCUS_SHORTCUT_EVENT_INIT = new KeyboardEvent('keydown', {
    bubbles: true,
    key: "F10",
    cancelable: true,
    view: window,
    keyCode: 121,
    which: 121,
    code: "F10",
    location: 0,
    altKey: true,
    ctrlKey: false,
    metaKey: false,
    shiftKey: false,
    repeat: false
} as EventInit);

export const ENTERKEY_EVENT_INIT: KeyboardEventInit = {
    bubbles: true,
    key: "Enter",
    cancelable: true,
    view: window,
    keyCode: 13,
    which: 13,
    code: "Enter",
    location: 0,
    altKey: false,
    ctrlKey: false,
    metaKey: false,
    shiftKey: false,
    repeat: false
} as EventInit;

export const ALT_ENTERKEY_EVENT_INIT: KeyboardEventInit = {
    bubbles: true,
    key: "Enter",
    cancelable: true,
    view: window,
    keyCode: 13,
    which: 13,
    code: "Enter",
    location: 0,
    altKey: true,
    ctrlKey: false,
    metaKey: false,
    shiftKey: false,
    repeat: false
} as EventInit;

export const BACKSPACE_EVENT_INIT: KeyboardEventInit = {
    bubbles: true,
    key: "Backspace",
    cancelable: true,
    view: window,
    keyCode: 8,
    which: 8,
    code: "Backspace",
    location: 0,
    altKey: false,
    ctrlKey: false,
    metaKey: false,
    shiftKey: false,
    repeat: false,
} as EventInit;

export const DELETE_EVENT_INIT: KeyboardEventInit = {
    bubbles: true,
    key: "Delete",
    cancelable: true,
    view: window,
    keyCode: 46,
    which: 46,
    code: "Delete",
    location: 0,
    altKey: false,
    ctrlKey: false,
    metaKey: false,
    shiftKey: false,
    repeat: false,
} as EventInit;

export const SPACE_EVENT_INIT: KeyboardEventInit = {
    bubbles: true,
    key: " ",
    cancelable: true,
    view: window,
    keyCode: 32,
    which: 32,
    code: "Space",
    location: 0,
    altKey: false,
    ctrlKey: false,
    metaKey: false,
    shiftKey: false,
    repeat: false,
} as EventInit;

export const ASTERISK_EVENT_INIT: KeyboardEventInit = {
    bubbles: true,
    key: "*",
    cancelable: true,
    view: window,
    keyCode: 56,
    which: 56,
    code: "Digit8",
    location: 0,
    altKey: false,
    ctrlKey: false,
    metaKey: false,
    shiftKey: true,
    repeat: false,
} as EventInit;
export const BACKTICK_EVENT_INIT: KeyboardEventInit = {
    bubbles: true,
    key: "`",
    cancelable: true,
    view: window,
    keyCode: 192,
    which: 192,
    code: "Backquote",
    location: 0,
    altKey: false,
    ctrlKey: false,
    metaKey: false,
    shiftKey: false,
    repeat: false,
} as EventInit;
export const UNDERSCORE_EVENT_INIT: KeyboardEventInit = {
    bubbles: true,
    key: "_",
    cancelable: true,
    view: window,
    keyCode: 189,
    which: 189,
    code: "Minus",
    location: 0,
    altKey: false,
    ctrlKey: false,
    metaKey: false,
    shiftKey: true,
    repeat: false,
} as EventInit;
export const TILDE_EVENT_INIT: KeyboardEventInit = {
    bubbles: true,
    key: "~",
    cancelable: true,
    view: window,
    keyCode: 192,
    which: 192,
    code: "Backquote",
    location: 0,
    altKey: false,
    ctrlKey: false,
    metaKey: false,
    shiftKey: true,
    repeat: false,
} as EventInit;

export const NUMPAD_ENTER_EVENT_INIT: KeyboardEventInit = {
    bubbles: true,
    key: "Enter",
    cancelable: true,
    view: window,
    keyCode: 13,
    which: 13,
    code: "NumpadEnter",
    location: 0,
    altKey: false,
    ctrlKey: false,
    metaKey: false,
    shiftKey: false,
    repeat: false
} as EventInit;

export const INSRT_IMG_EVENT_INIT: KeyboardEventInit = {
    bubbles: true,
    cancelable: true,
    view: window,
    key: "I",
    keyCode: 73,
    which: 73,
    code: "KeyI",
    location: 0,
    altKey: false,
    ctrlKey: true,
    metaKey: false,
    shiftKey: true,
    repeat: false
} as EventInit; 

export const INSRT_TABLE_EVENT_INIT: KeyboardEventInit = {
    bubbles: true,
    cancelable: true,
    view: window,
    key: "E",
    keyCode: 69,
    which: 69,
    code: "KeyE",
    location: 0,
    altKey: false,
    ctrlKey: true,
    metaKey: false,
    shiftKey: true,
    repeat: false
} as EventInit; 

export const INSRT_AUD_EVENT_INIT: KeyboardEventInit = {
    bubbles: true,
    cancelable: true,
    view: window,
    key: "A",
    keyCode: 65,
    which: 65,
    code: "KeyA",
    location: 0,
    altKey: false,
    ctrlKey: true,
    metaKey: false,
    shiftKey: true,
    repeat: false
} as EventInit; 


export const INSRT_LINK_EVENT_INIT: KeyboardEventInit = {
    bubbles: true,
    cancelable: true,
    view: window,
    key: "k",
    keyCode: 75,
    which: 75,
    code: "KeyK",
    location: 0,
    altKey: false,
    ctrlKey: true,
    metaKey: false,
    shiftKey: false,
    repeat: false
} as EventInit; 

export const BASIC_MOUSE_EVENT_INIT: MouseEventInit = {
    bubbles: true,
    cancelable: true,
    view: window,
    detail: 0,
} as EventInit;

export const BASIC_CONTEXT_MENU_EVENT_INIT: MouseEventInit = {
    bubbles: true,
    cancelable: true,
    view: window,
    which: 3,
    button: 3,
} as EventInit;

export const SHIFT_ARROW_LEFT_EVENT_INIT: EventInit = {
    bubbles: true,
    cancelable: true,
    view: window,
    key: "ArrowLeft",
    keyCode: 37,
    which: 37,
    code: "ArrowLeft",
    location: 0,
    altKey: false,
    ctrlKey: false,
    metaKey: false,
    shiftKey: true,
    repeat: false,
} as EventInit;


export const SHIFT_ARROW_UP_EVENT_INIT: EventInit = {
    bubbles: true,
    cancelable: true,
    view: window,
    key: "ArrowUp",
    keyCode: 38,
    which: 38,
    code: "ArrowUp",
    location: 0,
    altKey: false,
    ctrlKey: false,
    metaKey: false,
    shiftKey: true,
    repeat: false,
} as EventInit;

export const SHIFT_ARROW_RIGHT_EVENT_INIT: EventInit = {
    bubbles: true,
    cancelable: true,
    view: window,
    key: "ArrowRight",
    keyCode: 39,
    which: 39,
    code: "ArrowRight",
    location: 0,
    altKey: false,
    ctrlKey: false,
    metaKey: false,
    shiftKey: true,
    repeat: false,
} as EventInit;

export const SHIFT_ARROW_DOWN_EVENT_INIT: EventInit = {
    bubbles: true,
    cancelable: true,
    view: window,
    key: "ArrowDown",
    keyCode: 40,
    which: 40,
    code: "ArrowDown",
    location: 0,
    altKey: false,
    ctrlKey: false,
    metaKey: false,
    shiftKey: true,
    repeat: false,
} as EventInit;

export const SLASH_KEY_EVENT_INIT: EventInit = {
    bubbles: true,
    cancelable: true,
    view: window,
    key: "/",
    keyCode: 191,
    which: 191,
    code: "Slash",
    location: 0,
    altKey: false,
    ctrlKey: false,
    metaKey: false,
    shiftKey: false,
    repeat: false,
} as EventInit;

export const AT_CHARACTER_KEY_EVENT_INIT: EventInit = {
    bubbles: true,
    cancelable: true,
    view: window,
    key: "@",
    keyCode: 50,
    which: 50,
    code: "Digit2",
    location: 0,
    altKey: false,
    ctrlKey: false,
    metaKey: false,
    shiftKey: true,
    repeat: false,
} as EventInit;

export const TAB_KEY_EVENT_INIT: EventInit = {
    bubbles: true,
    cancelable: true,
    view: window,
    key: "Tab",
    keyCode: 9,
    which: 9,
    code: "Tab",
    location: 0,
    altKey: false,
    ctrlKey: false,
    metaKey: false,
    shiftKey: false,
    repeat: false,
} as EventInit;

export const ESCAPE_KEY_EVENT_INIT: EventInit = {
    bubbles: true,
    cancelable: true,
    view: window,
    key: "Escape",
    keyCode: 27,
    which: 27,
    code: "Escape",
    location: 0,
    altKey: false,
    ctrlKey: false,
    metaKey: false,
    shiftKey: false,
    repeat: false,
} as EventInit;

export const CONTROL_A_EVENT_INIT: EventInit = {
    bubbles: true,
    cancelable: true,
    view: window,
    key: "a",
    keyCode: 65,
    which: 65,
    code: "KeyA",
    location: 0,
    altKey: false,
    ctrlKey: true,
    metaKey: false,
    shiftKey: false,
    repeat: false
} as EventInit;


export const SHITFT_PAGE_DOWN_EVENT_INIT: EventInit = {
    bubbles: true,
    cancelable: true,
    view: window,
    key: "PageDown",
    keyCode: 34,
    which: 34,
    code: "PageDown",
    location: 0,
    altKey: false,
    ctrlKey: false,
    metaKey: false,
    shiftKey: true,
    repeat: false
} as EventInit;

export const SHITFT_PAGE_UP_EVENT_INIT: EventInit = {
    bubbles: true,
    cancelable: true,
    view: window,
    key: "PageUp",
    keyCode: 33,
    which: 33,
    code: "PageUp",
    location: 0,
    altKey: false,
    ctrlKey: false,
    metaKey: false,
    shiftKey: true,
    repeat: false
} as EventInit;

export const SHIFT_HOME_EVENT_INIT: EventInit = {
    "key": "Home",
    "keyCode": 36,
    "which": 36,
    "code": "Home",
    "location": 0,
    "altKey": false,
    "ctrlKey": false,
    "metaKey": false,
    "shiftKey": true,
    "repeat": false
} as EventInit;

export const SHIFT_END_EVENT_INIT: EventInit = {
    "key": "End",
    "keyCode": 35,
    "which": 35,
    "code": "End",
    "location": 0,
    "altKey": false,
    "ctrlKey": false,
    "metaKey": false,
    "shiftKey": true,
    "repeat": false
} as EventInit;

export const IMG_BASE64: string = `/9j/4AAQSkZJRgABAQEASABIAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCACTANwDASIAAhEBAxEB/8QAHQAAAQQDAQEAAAAAAAAAAAAAAwACBAYBBQcICf/EADkQAAEDAwMDAgUCBAYBBQAAAAEAAgMEBREGITEHEkETUSIyYXGBFJEIUqHBFRYjYrHRQxckJTRC/8QAHAEAAQUBAQEAAAAAAAAAAAAAAgABAwQGBQcI/8QALhEAAgEDAwIFBAICAwAAAAAAAAECAwQREiExBUEGEyJRcRRhkdFCsSQygeHw/9oADAMBAAIRAxEAPwAKysNCd2r2/J48YHKcljCSEdISSSymYZhJJJMIR4TVkrCQjB4Q3cp7uUx3KRIgb+UM8oj+UNxSGYM8JjuE88Jh4SQDBScIJUh/Cju4SYOAb0GTjKK87FBd8qJDAneVHlUh6jyIx5ADwgv4KM7goT+D9kTImR3oT0V6E/dOMR5RklAI3UiXlAI35KfAODsAGE4cIYKdlQFiPBk8rCSSQQkkkspmxCSSysdyYRglYPCysE7JBDTxlMJ5KcShvPhIMYUxyc4pjvlKQI1yY5OcmuKQ2AT9kJyM76oLvKQDBO8oL/lRnb5QX57USBAv2CA9HdugPCMKXBHf5QpOEV6FJwiIWR3eUJ6K7bKE9OMR5EEjJRpOEEjJRCOvJLAGAsquSjgcpLBGAsg5SCEmnlOSIyhHGpJEYSSEYcmrJ5WEiQaeUN5ycJ6E7kpCY08ppKymlIEaUw8o7aaV0fqCNxZnHdjZdA6R6dtFy1HUxXNxMlGzucXO7WMl8MGfmfvxwNuVz7y9pWcNdR/C9y9bWVW7lpgtu7K9ZunlwuUP62sDbbbWZdJPO4NcGgZJDeStVcb7o2zGSSKKsubB8DfVf2Any74QDj2Vxv8AJFDqS42h8xbR9xfK5z8nycFx553XnrXUrYrpUiCXuhc8+m3gBvuvPrjrd3Xl6XpX2N1b9HtaEfUtT+51ay1ujdSzej6lXaXEtAkLxK3ON9iP7p966f11LWvjt/8A8nSkF7JoRy0bnI5Gy4ZRz1dCA6J3pE7h8g3/AAP+1cNAaxjsWoYau5VlVV/Fh4fP6TCPqRv+FYtut3FD/d6l9yC46Nb1l6Fpf2Nm4H+qC/2V56jU9nq5aW+WBrI7bWjDoYyS2N45AJ3IPKorzyvRravG5pxqw4Zg7ilK2qOlPlAXjdBcMhFcUJ52VsosjvQXI8jcDPugPSQwCUbIBAyjycIJ5RCOvNWUxjkRuMjPCrkyMJYwtr6dLJR5a3Eq1jmEZ2OyBSySOOBgO6cBkrHlOa0uOyQyWQghDmHfdAc3tcQUaQGPGHZWBhrcnclMERjykiu7ce5QXbIghqG4YKeXAKHcbtSWg07quRoMzwxkIPxu9zj2+qgrV6dvDXUeETUqM681Cmss2drs1Ze6tlPRwmWRxxnho+pJ2A+pReoluZ09pIoojHfLrNw2n3hi+58/8LkHULqjqOWorI6Z7rfaXTBsNPDthgGAD9eST9Su9fw12wajsctdfS2p9U9scUzQe73dkrFXPWKtbKj6I9vd/o11v0mlRacvW+/sv2N6NSXyvhca65U8VZKR6cb6ZsrIhv8AKCMKXrTTNB021VR3J1XPW19RIZZHTfI0nckDwSdz91H1/VM6d6tE9O6Klp5Dlh7vlaAPH3KqmvdTXDV9Zb4p6KWjosBzX1B7Jph745Y3+v2WVqVZ1tpb4NJCnGk8x7geo+q6K7VgbbBJV3CX4pY4/hYD7vdwB9OfoqbarHBdrliZ4rq/jbaKL6NH913TTWjaa/aVlo3CCmBZ2RsgaG9n1yqBXdH9Q6dmkdb2CVgyfUi5A+yDTgPVk0V66bCGNoZIZZjyANgub3/RFZQVLu55OT8LW8rqOn9RS224RwXCUhr34kmlyA0eVC13qKgu1zmp7Q4TlsfaXEbNGfP1OeFJCGqWEiOUlFZZqNFvlfpyc1VSXyMkbHFE5xOBvnA4A4U6Tj8qFY7YbZSFrz/qvPc4fy+w/CmSHhesdNoSt7eMJcnmHUriNxcylHgCeChPOEU8IL11GctgXkoL0V6E9EhIDJwgHlSJPlUc8pxjrLDsjs3I8qPGMqZHC/0y/wABV3sTLcLG7LttgpUTo9w4DhQA7CTHb75wo2iVPAaWBrXZ8H2RInRtZgjLvCF6hkP2U6gFKPilOXBRy2Qcd2a6oa4Oz24UdxKuMFnpbkARL2E+Ey5aXbSRSOhIm7RkkoFWinhkjoyxkppKG5xyMDJPhEm2kI4+ii397qazTR0J9a7PZlrG8Rt/7Q3FzC2hrmSW9vK4noiDudSaKanpG4dcal2I4iO7sb5e4fQeFyw2K+3TVZvFYJIqQzZjfOd3MzsAPsrR01oLtV6o77rHK2ORvpukecEjfbPOCSV3bX+gzcNLwS0MYM1OQ8g8doBXnfUL2dd6pvjt7G8srOFCOmC57+4S0aBtV/0d2zU0IlkjGH9gJB8FcyZ1Db0yqn2+Vr5alri2GlgHxyke3ho9ydgnu6u1mlbe6yW1rLlqOoHwREd0NGz+eUjfPs3k+cLonR3SWlJKdzblM646guDw6pqatnxzOPgezRnYbLhpOq8s67xDYomkap2pNWM1FrB7JJ2H/wBrQMb3xwDwMnl3u4/jC7zdtFWnVtBE+WGFk0wBiqMfGB7BWC8dJ7LVWxlHT00FLK09zHs5H391UtZU7umV7td6mdLcbfExrC0bNY4ePYBWdDRX1p8cjLx0xuOirY25UlQ2qpI8eo2T4S3fnHkK9dN6uzalt5jfKx1a0f6nfgNP2UZ3Wyz1lrhmZVRH12d36dzmlw+hGVxvVBpr3dZ623uktbCC55if2jPuBwFajaze8SvK4gniZ2LVf8POi7xczd7xUx0lJCzLomEMYcb5PuVwzqdftGWu1nT+iKCmNPJJ6tXcvRxJKRw0OIzjyqPU36vp5aqGK61tTDI7d08xft9PZaZ+5ydytb0zorpSVxXfwjK9R6wpxdCj+QbzygyFFcgPO5WxMiMPCBJ9OEVxQZD4RC7gneUJ6IeENxRDgnjIUc8qQ84Cju5SBOsQuAK3sTGilyHfC4bhVtkm6mx1XbERnlVpRyWYSSD5ETj5CC6TJ2CC6buGMrDH4KWBNmwoqWSskw3IHupM1nlic0h3cEW03OGCIhwAKmvnjd/qveGsA2AKrSlJS2LMYx05NlpunZTNfNUOAIGACotdeQx07Q84eMBaSe6d7yGuPbwsMdG8Bz3DYKPy3nUyTzNsRIslG6SCqqSHERRl4Y35nHgAfkqToq31NZqBplpo2F0bWtDd2swN9/JyTur/ANM9NtvNLPIcPEr+3tPGBj+63l609FbLowiNryCD2tGMLFdYunKs4domw6VbqFFS7soWu9L/AOBzwVUDQHSjHw/ze6rmpOrVVqJseiNOVIFc8CO53ho7o6FnDmt8GTjfhv32Ejqj1A/9UtRU+itFmSJkBMV1vdP8Xp+HRQHgu93eOBvuO7dG+kOhNLaaktlkohUOwBUPqxmYn3+n4WbjCVSWqXB3ZTUFhGn6IdDNB2CxTRW5kd6q5N6usqXF0r3Hk78fdWW9dGqekuVJNYu6mDn9s2XZ9NvuDytrZtFssWoZ5KKrmgpmDBY3G59iR7fZaq/3yu6fXJ1Y176u11DwZpJiXOZ7/ZW1HONivq+5D1XaZen1yornSzT1VO/4JvVfkErYXr/DdUWSQNfHVUkrcOAORn228qVdtSUOoLJ6jXCqpJ2ZG2VwbVVor7dRmK13OvoI2uLsteGgk+43z+yuU6Ms7cFOpVjjc0GseltoiuDJKSaemma47RSnJ/PjC0twpJLLROpXXCqqnPPc4TyZwPZSZpa634nqLnPNJj4WuI3Pudgq9VVclTK573FxJzutZ06yUpKpJcGZv7xxi4ReWyO7lDcU8lDdytQzLDHnCjuPKJIduEIlOhxh4QZDyEZ3CjvOd0SEgbihu4T3FCeSEQ7eBkiAeURzj5Qid0+CPJ03D4nFrmlpHgjCc0kr1nWdUNGVVvdVvpLbU4G7paeNxH3JC5bqD+IDR1ojqZoLDaqhsR/1mspIw5o/mxjcLzp+LaK5pP8AJ6CvClWT9NRfg4/3JwcRhW2f+KfRFTL6dRpi3PZ4cKRg/wCAplP146WXCL0Z9O0kTHf+SKPtcP2RR8W2/wDKk1+An4TuUvTURRxKQjfqXPaGkkhbepoLJqV8tVpO4Mq4huaKV2JmD/bn5h/VaUyCIFjmEPB3zyFqrO+t7+n5lCWf7XyZW7sbiwn5deOP6fwFjaXYHBKxKx7ZPTwS4nAAQYnySzAMa57ycANGSSuxdF+lUeotW0rrpVNhfSPZVS0ZAce0HID/AGJxwpbitC3g5zfBDRoyryUIovvS7Q1xtGhqRlRE+F9W905GCHBpxge6rHUPTd26iXP/AChpiT9LSkEXa6iUCQMPMMfsT5f4GwXWdX6/o7tqQ6Rtksja90eJXUrcGmZ4+IfKePsnx6di0e6GT9XUubKQJnOIaHu9zjZeWVZu6qyqPuz0ilFW9ONNdkVvpp0U0p07oYrY2zQRTxjLJ3PyXYHPOy29vttto7ldIrfVugdPy1uC5p84J3S1HWxvu9HFV936VuZPWafh+gctPrOeMGG50MzYqmnGQQwkOHsQFPGDZG5oHqGnqtKVP660sfUMdvUNc7uc/wDda+o1vZNVWSfM0b4XAxzRSjBafIP1WmunVWnEPZK2Rkp2LXsLclcl1OHXKZslDI+3QiT1jHEe1krv92OQr1O3k2U511jHc2F0FXbTJTWW/dtMc+nH2kiL7DG6qs1fcKOdwul1/WNGcPEID/2BwhPrK2n9JskweGAueWDHec8fZaW51jquQuIA+gWhs7DLy9kcO7vtKwt2DuFb+qqZJGl3a47dx3woLinIbitUoqCwjKyk5PU+TDihuOBlOcUKQ7cp+QEMe7KE4pxKGSjwOxrzhR3FFeUBxwnQuBpKDI7JT3u2KC44RgN5GPOUIndOe7dCOSeU6AZorpeNRWSV9PXxT03gxSAgOHnlUq9amq6GbvdI4tyGgk/Mw+/9QvaHXWGy3iy1EJigllYD2uAw9hxyCvC+r6CoqrpTUEDHSyyS9rGNG7j4AH3XzwlFrKR9AwlLOCDNenxVckQcSxvy/Y8KVBqCRp3ft75XdLt/BrcbDQ0tfdK54bLGx0j6UNkYxxG7Sc5GONwst6HacjtrqZrZ/wBQR/8AZL8u/bjC7lt0S7u6fmUsNfP6OXcdatLSp5dVtP4/eDjmn+oVZaroJYah0XadnNdhet+hms7b1evNDarzCXVpIBqondpeP9//AHyvImv+mVVo+tbishqIn/IGEep+W8j78K79GNf1mgW1MjIAyeUxhlS/PeztJJxjwRthcunG5sK7eXCSOrP6e+obpTg+Mn1n0L0W0/p6khNPRxtlduXP+J/GM9xUHWenaDQ1XF/gFOf8w17iIIWP7mnYgveD4AOcrzDof+NavtRE1YWmmDQPTecvP1Hsu89F+pln6hUd51fHcTWV73GGVk7MfpIxu1jfoeSfP4XQ+uq3MnDU8s4lSwhaxU9Kwja2fRNp0Ba3TVM4nuU7/Wq62Q7ySHn4vb2B/uptxa660pNNVOY0/EIicn7j3Cr+s77PWWmSqt7Y6oAlxpcZE0fkfQ+QVyyJl5goJqy0TyTWU4c2EPJkhGd+3O4LT+cbey7VvZZjzg41a60y4yXW66lmt8vo3WhMsDCczQtwR9QDwD7LVUOoLTc7mIXTOe14wwS4aAeDuf8AhRae5R3anbS1ddJPO9u8NQ3tZIfYO5Yf6H28qsahpae2ztdJCXRN/wDKB2yR/fHzY910adqm9PDKU7j+S4LRqXp5a3ONRTVU8kz9/RY0Ob++/wDRc1vlglsME0ha5sOcgPacg/RWqh1C+107pnEzxtaHeoH5Dh+OCqZrvX8l3zT08znwOGHB4BOPv5+66Nrb1Nai0ULmvBQcs7lOrqw1MpcBjxt5UCV22Fl7/wB0FxyVqoxUVhGWlJyeWNccBDc5PfwhHlHjIDGPdhBeUV/BQXJ0sD4GFYmeHEdoxgLJKE47J8ZBbwCceUJxynvcgvdhGRt5Yx7kB52RHFAkKdLIzYx7sZQS/PhPkd8KF3Y8BSYIdRW9QdR7neZHGaRw34BVRrbnVU91orrRAmrgf3NcBktd7rf32zmhrXNc3DScglMt0YjkD2jDvdfPWhNNH0FGbhJS9i82brzrKqo5LfLFLNFIe580zCAB7DKm3fX1Q+kjioovSqHNHqSOGzTj/wDKq362WNmS7gIc11bCxr3FpLhthWbOtVsIzhQk0pf+2IrynRvpQnWppuPH/fuauqtUktQaysf6rslz3vdlxK1d0vERp/UhDW9pw4YUu63F1R3AuJBHhaG32eqvdQ6loqeSoe847Yxn9/ZVZKc54W7ZNrUVlvCQCC6zOrMB7g074J4Xrr+EK5VVltl/E5Ip7q1kbWu8hvdv+7sLjGkui0dNJHVXmQPeN/00Z2/LvP4XbdMVkNqmjbG1sETAGhrdgB7LW2HQ6+PqK6xjhd/+TLX/AF2hP/HovPu+x3Gw3ZltdU239TM8wyExNOMBjuG++Ppj8qRp+/sNVURve2lrXk+vSFvwud/M37hVajv7R6UraZlbI0HulDu17WAb7+fsoVbry3STSyPh9GspD6Yc4nLgPqP7+60H07qN4XJn3XUEsvgvGoLdDW0bq2mYI5WD4427g43yFVbpeGtp3mUNnjnYS0u3LCNs/wBlpx1TZTMPY0PPqF7RnAwfCqWoNVCvLRSkxx7t7COArVC1qZSkirWuqeG4s1tRdZYHSwQzO/TF2Wtz8q1L37n3KfI7OSo5dvutBGKWxnnNye4iUxxwsk4+yaTk5UyQLGu4Q3HdPcUNx5SQIJ5yUInHKI9pA7vBQnHdEtxNjHOQXvzkIjigv5KIBg3FBeUV/CA9GkRN9hjio7iivOAUB5wnQLYJ5yUMpzzyhEnPhFgjexjXzWnHwjY7bKpU23CSS+eocH0FLkbXzP7CO44wtMZnyAdzid/KSSXcdcGzoIGVFXTxyN7mPla1w9wV3202+mtVshpaOCOngHxdsbcEk8knk/lJJbvw5CEnOTW6wYfxDOSjCKezySE6M4eEklvpcGE7o3uk62dt6gAkOCHDB32wtff3E3itJ8yHKSSpxSVV49kWptuivk1qSSStFMY4obkkkSHQjsEM7ZSSRIdjHnZAeTukkkgGDcTjCG7ykkjQINyjvOAUkkaBlwCed0Jx2SSR9iLuAl+U/dR5OAkkkgJAnoZGUkkZGz//2Q==`;
export const AUDIO_WAV_BASE64: string = "UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YQAAAAA=";
export const VIDEO_WEBM_BASE64: string = "GkXfo59ChoEBQveBAULygQFfQoaBAgEAAAAAAAAVQAAAAAAAEAAASGFuZGJyYWtlAAAAAAABAAEAAAAAAQAAAAAAAAAAAA==";
