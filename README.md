# 🌱 SEMOthon 팀 3 - Study & Tree Ranking Backend

스터디/소모임 활동을 기반으로 나무를 키우며 경쟁하는 랭킹 시스템!  
사진 인증과 연속 출석 기반의 활동 포인트 시스템을 통해,  
친구와 그룹 간 건강한 경쟁 문화를 만들어가는 웹 서비스의 **백엔드 레포지토리**입니다.

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **Cloud**: AWS EC2, S3
- **Auth**: JWT
- **Email Service**: Gmail SMTP
- **Others**: EXIF 기반 사진 인증, OpenAI API 활용

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
- 개인 / 그룹 / 친구 간 실시간 랭킹 제공 (일간 / 주간 / 월간)

---

## 🚀 배포 주소

🔗 [http://15.164.104.116:3034](http://15.164.104.116:3034)

---

## 🧪 로컬 개발 환경 세팅

### 1. 프로젝트 클론
git clone https://github.com/semothon/2025_TEAM_3_BE.git
cd 2025_TEAM_3_BE
2. 패키지 설치
bash
복사
편집
npm install
3. .env 파일 설정
루트 디렉토리에 .env 파일을 생성하고, 다음 내용을 입력합니다:

env
복사
편집
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
⚠️ .env는 민감한 정보가 포함되어 있으므로, .gitignore에 반드시 포함되어야 합니다.

4. 서버 실행
bash
복사
편집
npm start
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=ap-northeast-2
AWS_S3_BUCKET=semo
⚠️ .env 파일은 GitHub에 업로드되지 않도록 .gitignore에 반드시 포함시켜야 합니다.

4. 서버 실행

npm start
