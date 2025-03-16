// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as bootstrap from 'bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';

console.log(bootstrap);

import { Card } from './components/card';

customElements.define('product-card', Card);
