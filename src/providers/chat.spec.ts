import { async, TestBed, inject } from '@angular/core/testing';
import { ChatProvider } from './chat'
import { DataService } from '../app/app.data';
import { Events } from 'ionic-angular';
import { EventsMock } from "ionic-mocks"

describe("Chat Service", () => {
  let chatService: ChatProvider;
  let chatSpy;
  beforeEach(() => {
    chatSpy = jasmine.createSpyObj('ChatProvider', ['initializebuddy']);
    TestBed.configureTestingModule({
      providers: [
        DataService,
        {provide:Events, useValue:EventsMock},
        ChatProvider
      ]
    }).compileComponents();
  });

  it('should be created', inject([ChatProvider], (chatService: ChatProvider) => {
    expect(chatService).toBeTruthy();
  }));
});
