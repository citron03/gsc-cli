# gsc-cli GUI (브라우저 기반) 사용 가이드

이 프로젝트는 CLI뿐만 아니라 브라우저 기반 GUI도 제공합니다.  
아래 안내에 따라 GUI를 실행하고 사용할 수 있습니다.

---

## 1. GUI 실행 방법

### 1) 의존성 설치

루트 디렉터리에서 한 번만 실행:
```bash
pnpm install
```

### 2) GUI 개발 서버 실행

아래 명령어로 Vite 기반 GUI를 실행합니다.
```bash
pnpm gui
```
- 기본적으로 [http://localhost:5173](http://localhost:5173) 에서 접속할 수 있습니다.

---

## 2. 주요 기능

- Google 인증 및 Search Console API 연동
- URL 검사 및 색인 요청
- RSS 기반 자동 인덱싱 요청

---

## 3. 백엔드 API 서버 연동

GUI는 기존 Node.js 백엔드([src/server.ts](src/server.ts))의 API와 통신합니다.  
아래 명령어로 백엔드 서버를 별도로 실행해야 합니다.

```bash
pnpm start:server
```

> 필요 시, `package.json`에 `"start:server": "ts-node src/server.ts"` 스크립트를 추가하세요.

---

## 4. 참고

- `config.json`, `credentials.json` 등 인증/설정 파일은 루트에 위치해야 하며,  
  CLI와 동일하게 동작합니다.
- GUI에서 제공하는 기능은 CLI와 동일하며, 브라우저에서 보다 직관적으로 사용할 수 있습니다.

---

## 5. 문제 해결

- 인증 오류, API 호출 실패 등은 터미널의 백엔드 서버 로그를 확인하세요.
- 포트 충돌 시, `web/vite.config.ts`에서 포트를 변경할 수 있습니다.

---

## 6. 기타

- GUI 개선 및 기능 추가는 자유롭게 PR로 기여해 주세요.