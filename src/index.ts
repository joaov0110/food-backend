import config from 'config';

import main from './app';

main.listen(config.get<number>('port'), () => {
  console.log(`Server running on port ${config.get<number>('port')}`);
});
