# obsidian-typewriter-mode-patch
This is a patch for obsidian-typewriter-mode to fix korean characters input issue.

Temporary fix to js file and needs to fix `plugin.ts` in src/cm6/plugin.ts.

obsidian-typewriter-mode를 사용할 때 받힘을 적고 모음을 입력할 때 글자가 사라지는 문제를 해결합니다. main.js를 그대로 교체하면 됩니다

IME(입력기)가 아직 글자를 “조합”하는 중인데 Typewriter Mode가 강제로 스크롤 트랜잭션을 디스패치해 버려서, 브라우저가 조합 과정을 중단하고 글자를 지워 버립니다.

1. 브라우저-IME 동작 방식
자모 키 입력:	compositionstart → compositionupdate …	(아직 실제 텍스트가 아닌 ‘조합 상태’)
글자 완성:	compositionend	(이때 완성된 글자가 에디터에 확정됨)

CodeMirror(Obsidian 에디터)는 같은 흐름을 가집니다.
- 조합 중: view.composing === true
- transaction에는 Transaction.userEvent = "input.compose"가 붙음

It 클래스
```
update(update: ViewUpdate) {
  const { isUserEvent, allowedUserEvents } = this.inspectTransactions(update);

  // "input.compose"도 allowedUserEvents=true 로 분류됨
  if (allowedUserEvents) this.updateAllowedUserEvent();
}

updateAllowedUserEvent() {
  ...
  this.recenter(view, scrollOffset); // 여기서 새로운 트랜잭션 dispatch
}

recenter(view, offset) {
  const eff = EditorView.scrollIntoView(pos, { y: "start", yMargin: offset });
  view.dispatch(view.state.update({ effects: eff })); // <-- 문제
}
```
- 조합이 진행 중인데도 scrollIntoView 트랜잭션을 추가로 디스패치
- CodeMirror는 새로운 트랜잭션을 받으면 현재 조합을 강제로 끝냄
- 미완성 글자는 사라지고(compositionend), 다음 키를 눌러야 새 조합이 시작됨
