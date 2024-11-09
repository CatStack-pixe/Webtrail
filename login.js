// 设置 Cookie
function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000)); // 设置过期时间
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/"; // 设置 Cookie
}

// 获取 Cookie
function getCookie(name) {
    const cname = name + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1);
        if (c.indexOf(cname) == 0) return c.substring(cname.length, c.length);
    }
    return "";
}

// 注册功能
function register() {
    console.log("Register function triggered"); // 添加日志
    const email = document.getElementById('register-email').value;
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;

    // 检查输入的有效性
    if (email && username && password) {
        // 将用户信息存储到 Cookie
        const userInfo = JSON.stringify({ email, password });
        setCookie(username, userInfo, 7); // 7天过期

        document.getElementById('auth-message').textContent = 'Registration successful! You can now log in.';

        // 显示登录表单，隐藏注册表单
        document.getElementById('register-section').style.display = 'none';
        document.getElementById('login-section').style.display = 'block';
        document.getElementById('auth-title').textContent = 'Login';

        // 聚焦到登录用户名输入框
        document.getElementById('login-username').focus();
    } else {
        document.getElementById('auth-message').textContent = 'Please fill in all fields to register.';
    }
}

// 登录功能
function login() {
    console.log("Login function triggered"); // 添加日志
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    // 从 Cookie 中获取用户信息
    const storedUser = getCookie(username);

    if (storedUser) {
        const user = JSON.parse(storedUser);
        if (user.password === password) {
            setCookie('loggedInUser', username, 7); // 设置登录状态 Cookie，有效期为7天
            window.location.href = 'index2.html';    // 登录成功后跳转
        } else {
            document.getElementById('login-message').textContent = 'Invalid username or password. Please try again.';
        }
    } else {
        document.getElementById('login-message').textContent = 'User not found.';
    }
}

// 检查是否登录
function checkLogin() {
    const loggedInUser = getCookie('loggedInUser');
    return loggedInUser !== "";
}

// 页面加载时检查是否登录
document.addEventListener('DOMContentLoaded', () => {
    const isLoggedIn = checkLogin();

    // 如果已登录，跳转到主页面
    if (isLoggedIn) {
        window.location.href = 'index2.html';
    } else {
        // 如果未登录，显示注册/登录界面
        document.getElementById('register-section').style.display = 'block';
        document.getElementById('login-section').style.display = 'none';
    }
});
