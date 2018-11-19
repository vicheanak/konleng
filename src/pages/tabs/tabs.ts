import { Component } from '@angular/core';

import { SearchPage } from '../search/search';
import { MePage } from '../me/me';
import { AddPage } from '../add/add';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = SearchPage;
  tab2Root = AddPage;
  tab3Root = MePage;

  constructor() {

  }
}
