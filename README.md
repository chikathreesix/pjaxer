# Pjaxer

Pjaxer is a standalone lightweight pjax library

## Usage

- Load pjaxer.js
- Initialize Pjaxer when the DOMs are loaded

```html
<script src="pjaxer.js"></script>
<script>
window.addEventListener('DOMContentLoaded', function(){
  Pjaxer('.pjaxer', '#target');
}, false);
</script>
```

## Development

- Running tests
```bash
grunt test
```
or open `test/index` in your browser
