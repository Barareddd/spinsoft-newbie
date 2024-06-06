import { AuthConfig } from "angular-oauth2-oidc";

export const authConfig: AuthConfig = {
  issuer: "https://accounts-cis.fm-sp.com/auth/realms/EMS", // URL ของผู้ให้บริการ Identity (IDP)
  clientId: "iDEMS", // Client ID ของแอปพลิเคชันที่ลงทะเบียนกับ IDP
  responseType: "code", // Response Type ที่ใช้ (เช่น code สำหรับ Authorization Code Flow)
  redirectUri: window.location.origin, // URL ที่จะเปลี่ยนเส้นทางไปหลังจากการล็อกอิน
  scope: "openid profile email", // ขอบเขตที่ต้องการ (scope) เช่น openid, profile, email
  silentRefreshTimeout: 5000, // เวลาสูงสุดในการรอการต่ออายุ token แบบเงียบ (silent refresh)
  sessionChecksEnabled: true, // เปิดใช้งานการตรวจสอบ session
  sessionCheckIntervall: 20000, // ระยะเวลาการตรวจสอบ session (เป็นมิลลิวินาที)
  sessionCheckIFrameUrl:
    "https://accounts-cis.fm-sp.com/auth/realms/EMS/protocol/openid-connect/login-status-iframe.html", // URL ของ iframe สำหรับการตรวจสอบ session
  showDebugInformation: true, // แสดงข้อมูลการ debug
  clearHashAfterLogin: false, // ไม่ลบ hash หลังจากการล็อกอิน
  nonceStateSeparator: "semicolon", // ตัวคั่นระหว่าง nonce และ state
  strictDiscoveryDocumentValidation: true, // เปิดการตรวจสอบ discovery document อย่างเข้มงวด
};
