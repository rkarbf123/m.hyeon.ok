# 모현욱닷컴

## 기능

- 문제집 / 실모 / N제 메뉴
- PDF 자동 분류
- PDF 보기 / 다운로드
- 한 페이지 최대 20개
- 페이지네이션
- 검색어 2글자 이상 검색
- GitHub Actions로 자료 목록 자동 생성
- 칼럼 메뉴 기반 마련

## PDF 추가

`materials` 폴더에 PDF를 넣고 GitHub에 push합니다.

파일명 앞에 다음 중 하나를 사용하면 자동으로 분류됩니다.

- `문제집`
- `실모`
- `N제`

예:

```text
materials/문제집 수학 개념.pdf
materials/실모 2027 실전모의고사 1회.pdf
materials/N제 미적분 N제.pdf
```

`materials/문제집/수학 개념.pdf`처럼 폴더 이름으로 분류하는 것도 지원합니다.

GitHub Actions가 `public/materials.json`을 자동으로 만들고 GitHub Pages를 배포합니다.

## GitHub Pages 설정

저장소의 **Settings → Pages → Source**에서 **GitHub Actions**를 선택합니다.

그 후 `main` 브랜치에 push하면 자동 배포됩니다.

## 도메인 연결

GitHub 저장소의 Pages 설정에서 Custom domain에 사용할 도메인을 입력합니다.

도메인 DNS는 GitHub Pages가 안내하는 값으로 설정합니다.
