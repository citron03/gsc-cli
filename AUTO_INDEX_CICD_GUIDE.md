# GitHub Actions로 RSS 자동 인덱싱 주기 실행 가이드

이 문서는 `pnpm start auto-index` 명령어를 GitHub Actions를 통해 **일주일에 한 번 자동 실행**하는 방법을 안내합니다.

---

## 1. 워크플로우 파일 생성

`.github/workflows/auto-index.yml` 파일을 아래와 같이 생성하세요.

```yaml
name: Auto Index from RSS (Weekly)

on:
  schedule:
    - cron: '0 0 * * 0' # 매주 일요일 00:00(UTC)에 실행
  workflow_dispatch: # 수동 실행도 가능

jobs:
  auto-index:
    runs-on: ubuntu-latest

    steps:
      - name: 저장소 체크아웃
        uses: actions/checkout@v4

      - name: Node.js 설치
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: pnpm 설치
        uses: pnpm/action-setup@v3
        with:
          version: 8

      - name: 의존성 설치
        run: pnpm install

      - name: config.json 및 credentials.json 복사
        run: |
          cp .github/ci-config.json ./config.json
          cp .github/ci-credentials.json ./credentials.json

      - name: RSS 자동 인덱싱 실행
        run: pnpm start auto-index
```

---

## 2. 인증 정보 및 설정 파일 준비

CI 환경에서는 **로컬의 `config.json`과 `credentials.json`을 사용할 수 없습니다.**
아래와 같이 별도의 파일을 준비하세요.

1. **`.github/ci-config.json`**  
   - 로컬의 `config.json`을 복사해 이름을 변경하여 `.github/ci-config.json`으로 저장합니다.

2. **`.github/ci-credentials.json`**  
   - 로컬의 `credentials.json`을 복사해 이름을 변경하여 `.github/ci-credentials.json`으로 저장합니다.

> **주의:**  
> 이 파일들은 **절대 외부에 노출되면 안 됩니다.**  
> 공개 저장소라면 [GitHub Secrets](https://docs.github.com/ko/actions/security-guides/encrypted-secrets)로 환경변수로 관리하는 것이 더 안전합니다.

---

## 3. 보안 권장 사항

- 저장소가 **공개**라면, 인증 정보 파일을 직접 커밋하지 말고,  
  [GitHub Actions의 Secret 및 환경 변수](https://docs.github.com/ko/actions/security-guides/encrypted-secrets)를 활용해  
  워크플로우 내에서 파일을 생성하는 방식으로 구현하세요.
- 예시(Secrets 사용):
  ```yaml
  - name: config.json 생성
    run: echo "${{ secrets.CONFIG_JSON }}" > ./config.json

  - name: credentials.json 생성
    run: echo "${{ secrets.CREDENTIALS_JSON }}" > ./credentials.json
  ```

---

## 4. 참고

- cron 표현식은 UTC 기준입니다.  
  한국 시간(UTC+9)으로 맞추려면 `cron: '0 15 * * 0'` 등으로 조정.
- 워크플로우가 정상 동작하려면  
  `config.json`과 `credentials.json`이 반드시 유효해야 합니다.

---

## 5. 수동 실행

GitHub Actions의 **Actions** 탭에서  
`Auto Index from RSS (Weekly)` 워크플로우를 직접 실행할 수도 있습니다.

---

이 가이드에 따라 설정하면, 블로그 RSS 기반 자동 인덱싱이 CI/CD 환경에서 주기적으로 실행됩니다.
