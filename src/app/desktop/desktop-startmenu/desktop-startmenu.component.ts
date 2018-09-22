import { Account } from './../../../dataclasses/account.class';
import { UserService } from './../user.service';
import { Component, OnInit, Input } from '@angular/core';

import { ProgramLinkage } from '../../../dataclasses/programlinkage.class';

@Component({
  selector: 'app-desktop-startmenu',
  templateUrl: './desktop-startmenu.component.html',
  styleUrls: ['./desktop-startmenu.component.scss']
})
export class DesktopStartmenuComponent implements OnInit {
  constructor(public userService: UserService) {}

  @Input()
  linkages: Array<ProgramLinkage>;

  @Input()
  target: EventTarget;

  searchTerm = '';

  url = 'https://api.dev.cryptic-game.net';

  token: string =
    sessionStorage.getItem('token') || localStorage.getItem('token');

  user: Account = new Account('', '');

  ngOnInit() {
    this.userService.owner(this.token).subscribe(data => {
      this.user.setName(data.owner.username);
      this.user.setEmail(data.owner.email);
    });
  }

  search(term: string) {
    return this.linkages.filter(item =>
      item
        .getDisplayName()
        .trim()
        .toLowerCase()
        .match(term.trim().toLowerCase())
    );
  }
}
