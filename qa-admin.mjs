const ADMIN_LAYOUT_SELECTOR = ".admin-layout-root";
const UI_TIMEOUT_MS = 10_000;

const credentials = {
  username: process.env.QA_ADMIN_USERNAME ?? "admin",
  password: process.env.QA_ADMIN_PASSWORD ?? "admin123",
};

const sections = [
  {
    menuName: "Đăng ký Tuyển sinh",
    heading: "Quản Lý Đăng Ký Tuyển Sinh",
    screenshotPath: "verify-admin-submissions.png",
  },
  {
    menuName: "Đội ngũ Giáo viên",
    heading: "Danh Sách Đội Ngũ Giáo Viên",
    screenshotPath: "verify-admin-teachers.png",
  },
];

async function captureSection(page, { menuName, heading, screenshotPath }) {
  await page.getByRole("menuitem", { name: menuName }).click();
  await page.getByRole("heading", { name: heading }).waitFor({
    state: "visible",
    timeout: UI_TIMEOUT_MS,
  });
  await page.screenshot({ path: screenshotPath, fullPage: true });
}

export default async function run(page, _ui) {
  await page.locator("#username").fill(credentials.username);
  await page.locator("#password").fill(credentials.password);
  await page.getByRole("button", { name: "Đăng nhập Quản Trị" }).click();

  await page.locator(ADMIN_LAYOUT_SELECTOR).waitFor({
    state: "visible",
    timeout: UI_TIMEOUT_MS,
  });
  await page.screenshot({
    path: "verify-admin-dashboard.png",
    fullPage: true,
  });

  for (const section of sections) {
    await captureSection(page, section);
  }

  return { success: true };
}
