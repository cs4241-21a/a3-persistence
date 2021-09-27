const critical = require('critical');

critical.generate({
    base: 'public/',
    src: './index.html',
    target: './index.html',
    inline: true
  }, (err, output) => {
    if (err) {
      console.error(err);
    } else if (output) {
      console.log('Generated critical CSS');
    }
  });