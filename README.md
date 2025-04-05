# 🌱 SEMOthon 팀 3 - 그루 Backend

스터디/소모임 활동을 기반으로 나무를 키우며 경쟁하는 랭킹 시스템 그루!  
사진 인증과 연속 출석 기반의 활동 포인트 시스템을 통해,  
친구와 그룹 간 건강한 경쟁 문화를 만들어가는 웹 서비스의 **백엔드 레포지토리**입니다.

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **Cloud**: AWS EC2, S3
- **Auth**: JWT
- **Email Service**: Gmail SMTP
- **Others**: EXIF 기반 사진 인증

---

## 📦 주요 기능

### ✅ 사용자 관련
- 회원가입 / 로그인 / JWT 기반 인증
- 이메일 인증 기능

### ✅ 스터디 / 소모임 관리
- 스터디 개설 / 가입 / 탈퇴 / 삭제
- 그룹별 활동 점수 집계 및 랭킹 제공

### ✅ 사진 인증 및 EXIF 검증
- 사진 업로드 시 EXIF 데이터를 기반으로 시간 및 위치 검증
- AWS S3에 사진 저장

### ✅ 나무 성장 및 랭킹 시스템
- 활동 점수를 기반으로 나무 성장 시각화
- 그룹 간 실시간 랭킹 제공

---

## 🚀 배포 주소

🔗 http://15.164.104.116:3034

---

## 🧪 로컬 개발 환경 세팅

### 1. 프로젝트 클론
```bash
git clone https://github.com/semothon/2025_TEAM_3_BE.git
cd 2025_TEAM_3_BE
```

### 2. 패키지 설치
```bash
npm install
```

### 3. `.env` 파일 설정  
루트 디렉토리에 `.env` 파일을 생성하고, 다음 내용을 입력합니다:

```env
# Database
DB_HOST=YOUR_DB_HOST
DB_USER=YOUR_DB_USER
DB_PASSWORD=YOUR_DB_PASSWORD
DB_NAME=semo
DB_PORT=3306

# JWT
JWT_SECRET=your_jwt_secret_key

# OpenAI (선택)
OPENAI_API_KEY=your_openai_key

# Email
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# AWS S3
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=ap-northeast-2
AWS_S3_BUCKET=semo
```

> ⚠️ `.env`는 민감한 정보가 포함되어 있으므로, `.gitignore`에 반드시 포함되어야 합니다.

### 4. 서버 실행
```bash
npm start
```

---

## 📁 디렉토리 구조 예시

```bash
2025_TEAM_3_BE/
├── routes/           # 라우터 정의
├── controllers/      # 비즈니스 로직
├── models/           # DB 모델
├── middlewares/      # 인증, 오류 처리 등
├── utils/            # 유틸 함수 (exif 분석 등)
├── config/           # DB, AWS 설정
├── .env              # 환경 변수 파일 (업로드 금지)
└── app.js            # 메인 서버 엔트리
```

---

## 👨‍👩‍👧‍👦 팀 소개

- 팀명: SEMOthon 팀 3
- 프로젝트 목표:  
  스터디 활동을 게임화하여, 나무 키우기와 랭킹 시스템을 통해 **동기부여**를 극대화한 플랫폼 개발

---

## 📌 향후 개선 예정

- [ ] OpenAI 기반 인증 보조 로직
- [ ] 관리자 전용 대시보드 추가
- [ ] 사진 중복 제출 방지 해시 비교
- [ ] 반응형 API 문서 제공 (Swagger)

---

## 📮 문의

- 관리자 이메일: [semo3te@gmail.com](mailto:semo3te@gmail.com)

---

> 본 프로젝트는 SEMOthon 과제의 일환으로 개발되었습니다.
