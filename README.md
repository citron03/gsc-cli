# gsc-cli: Tistory 블로그 Google SEO 관리 도구

`gsc-cli`는 Node.js로 만들어진 CLI (Command Line Interface) 도구로, Tistory 블로거가 터미널 환경에서 자신의 블로그 포스트에 대한 Google SEO 상태를 확인하고, Google에 직접 색인 생성을 요청할 수 있도록 돕습니다.

## 주요 기능

- **URL 검사:** 특정 URL의 Google 색인 상태, 모바일 친화성 등 상세 정보를 조회합니다.
- **색인 생성 요청:** Google에 특정 URL의 크롤링 및 색인 생성을 요청합니다.
- **자동화된 인증:** 안전한 OAuth2 흐름을 통해 Google 계정과 연동하며, 최초 1회 인증 후에는 자동으로 인증을 갱신합니다.

---

## ⚠️ 필수 사전 조건

이 도구를 사용하기 전, 아래의 조건들이 **반드시** 충족되어야 합니다.

1.  **Google Search Console 소유권 확인**
    - 관리하려는 Tistory 블로그가 [Google Search Console](https://search.google.com/search-console/about)에 등록되어 있어야 합니다.
    - 해당 블로그에 대한 **소유권이 확인된 상태**여야 합니다.

2.  **Google Cloud Platform (GCP) 프로젝트 설정**
    - [Google Cloud Console](https://console.cloud.google.com/)에서 프로젝트를 생성하거나 선택해야 합니다.
    - 해당 프로젝트에서 아래 두 가지 API를 **'사용 설정'** 해야 합니다.
        - **Google Search Console API**
        - **Indexing API**

3.  **OAuth 2.0 클라이언트 ID 발급**
    - 위에서 설정한 GCP 프로젝트에서 **'OAuth 2.0 클라이언트 ID'** 를 생성해야 합니다.
    - **애플리케이션 유형:** **'데스크톱 앱'** 으로 선택해야 합니다.
    - 생성된 **'클라이언트 ID'** 와 **'클라이언트 보안 비밀'** 값을 따로 저장해 두어야 합니다.
    - **OAuth 동의 화면**의 **'테스트 사용자'** 란에 **본인의 Google 계정 이메일**을 반드시 추가해야 합니다.

---

## 설치 및 설정

1.  **프로젝트 클론 및 의존성 설치**
    ```bash
    git clone <repository-url>
    cd google-seo-blog
    pnpm install
    ```

2.  **설정 파일 생성**
    아래 명령어를 실행하여 `config.json` 설정 파일을 생성합니다.
    ```bash
    pnpm start init
    ```

3.  **설정 파일 수정**
    생성된 `config.json` 파일을 열고, **'필수 사전 조건'** 3단계에서 저장해 둔 `클라이언트 ID`, `클라이언트 보안 비밀`과 본인의 `Tistory 블로그 전체 주소`를 입력하고 저장합니다.

    ```json
    {
      "clientId": "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com",
      "clientSecret": "YOUR_GOOGLE_CLIENT_SECRET",
      "redirectUri": "http://localhost:3000/oauth2callback",
      "blogUrl": "https://your-tistory-blog.tistory.com"
    }
    ```

---

## 사용법

1.  **Google 계정 인증 (최초 1회)**
    `config.json` 설정이 완료되면, 아래 명령어를 실행하여 Google 계정 인증을 진행합니다.
    ```bash
    pnpm start auth
    ```
    - 자동으로 브라우저가 열리면, 사전 조건에서 '테스트 사용자'로 등록한 Google 계정으로 로그인하고 권한을 허용합니다.
    - 성공적으로 완료되면 `credentials.json` 파일이 생성되며, 이후에는 이 명령어를 다시 실행할 필요가 없습니다.

2.  **URL 검사**
    ```bash
    pnpm start inspect "https://your-tistory-blog.tistory.com/entry/your-post-url"
    ```

3.  **색인 생성 요청**
    ```bash
    pnpm start request-indexing "https://your-tistory-blog.tistory.com/entry/your-post-url"
    ```

## 스크립트

- `pnpm start`: `ts-node`를 사용하여 개발 환경에서 CLI를 실행합니다.
- `pnpm build`: `tsc`를 사용하여 `src` 디렉토리의 타입스크립트 코드를 `dist` 디렉토리에 JavaScript 코드로 컴파일합니다.
