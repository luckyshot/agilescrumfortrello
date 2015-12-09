Agile SCRUM for Trello boards gives super-powers to your Trello boards by enabling SCRUM features:

- STORY POINTS: Set Story Points for Trello Cards
- TIME SPENT: Set time spent on tasks.
- TAGS: Group Cards into tags, User Stories or projects, these are colored automagically to save you time.
- PROGRESS BARS: Visualize your Sprint progress instantly with unobstrusive background progress bars on both cards and lists.
- HEADER SEPARATORS: Use header separators to group cards inside lists.
- VISUAL AIDS: Cards with more Story Points have a slightly increased font size so you can distinguish bigger from smaller tasks at a glance.


Instructions
------------------

[![Join the chat at https://gitter.im/luckyshot/agilescrumfortrello](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/luckyshot/agilescrumfortrello?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
There's no need to set up anything! This extension is made to be simple, install it and start giving super powers to your Trello.

Add Story Points to a card by typing the number in parenthesis:
"(3) Design new homepage header"

Track time spent on each card:
"(1/3) Design new homepage header"

Assign a card to a Project by writing it in square braquets:
"[dev] Implement Ads in footer"

Create a Header Separator by creating a new card with three asterisks at the start and end:
"*** Sprint 3 ***"

You can add as many tags as needed. Tags will be colored automatically in a random color.

Both Story Points and Tags can be defined anywhere in the card's text, it's usually best to add them at the start so it's easier to read.

At the top right of the Lists and Cards you can see how many story points have been completed and how many there are in total.


Compatibility
------------------
If a team member doesn't have the 'Agile SCRUM for Trello boards' extension installed he will still see be able to see Story Points and Projects as well as modify them (he won't see colors or progress bars). You can install/uninstall the extension at any time without loosing any data too.

'Agile SCRUM for Trello boards' is the fastest and with the best performance of all similar extensions and at simply 2KB of code, a seamless extension to have installed, even for slow computers or for those users who want Chrome to work fast and are concerned on having too many extensions, this extension has such a tiny footprint that goes unnoticeable.


Links & Resources
------------------
- Google Chrome Store: https://chrome.google.com/webstore/detail/agile-scrum-for-trello-bo/njmflagahgdhopbcdilgahjlfiecakpe?hl=en
- Source code: https://github.com/luckyshot/agilescrumfortrello
- Issue tracker: https://github.com/luckyshot/agilescrumfortrello/issues
- Blog post + Screenshots: http://xaviesteve.com/5109/agile-scrum-trello-boards/


Push Requests
------------------

Please read this before submitting your Push Requests:

- Follow the same SCSS/JavaScript coding conventions (and use TABS)
- Test and run your code through JsHint before pushing
- Comment, comment, comment. After approving the request we may remove some, but add comments everywhere so we know what's going on and why you coded it that way
- Features that are not directly related to Agile SCRUM and Trello will not be considered
- This extension is cool because it is not intrusive to its users, consider this before developing bells and whistles
- New features should be developed in a way that they don't become annoying to users without the plugin (i.e. story points become a number inside a parenthesis so you can still see what's going on when you don't have the extension installed)
- Code in jQuery or vanilla JavaScript and keep the code as tiny and performant as possible



Changelog
------------------
#### 1.4.3
- Fixed issue where it wouldn't detect story points longer than 3 characters (0/10.5)
- Changed method of detecting changes

#### 1.4.2
- Released Source Code under GPL license https://github.com/luckyshot/agilescrumfortrello
- You can add the '#' symbol inside tags
- Removed Settings button (not yet finished)

#### 1.4.1
- Rounded Story Points to one decimal

#### 1.4.0
- Huge refactoring for better scalability and future development of new features and feedback
- When Story Points get overrun then show them in a slight Red color, when estimation was perfect then show it in slight Green color
- Improved updates listener for better performance, responsiveness and less memory consumption

#### 1.3.5
- Fixed: 'innerHTML of null/undefined' bug
- Increased randomness of Tag colors
- Updated jQuery from 2.1.1 to 2.1.4

#### 1.3.4
- Fixed: Tag support for "." (dots)

#### 1.3.3
- FIXED: progress bar doesn't seem to work with themed backgrounds

#### 1.3.2
- Infinite decimals bug fixed

#### 1.3.1
- Can't remember, something awesome perhaps

#### 1.3.0
- Header Separators now count Story Points of tasks in them so you can have sub-groups inside each list (I use it to have archived Sprints in quarterly lists)
- Better tag coloring (always nice smooth colors!)
- Increased progress bars transparency for better readability

#### 1.2.5
- Fixed bug where Header Separators wouldn't show up when hyphens found

#### 1.2.4
- Header Separators

#### 1.2.3
- Fixed a bug where the extension would sometimes stop working when adding a new card

#### 1.2.2
- Progress bars colorize as a shade of the board background
- Design improvements
- Fixed a bug where Progress Bard wouldn't update correctly in some circumstances

#### 1.2.1
- Improved documentation
- Code optimizations

#### 1.2.0
- Faster and smaller code for blazing performance and tiny footprint
- Removed unnecessary files from extension pack by 20%

#### 1.1.7
- Automatically increase card's font size depending on Story Points
- Code optimization and performance
- Coded OOP design pattern

#### 1.1.6
- Added extension to Google Chrome Store
- Bug fixes