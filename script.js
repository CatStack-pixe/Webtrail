let votes1 = 2; // 初始票数（方楚辰）
let votes2 = 71432108; // 初始票数（TRUMP）
const totalVotes = 200000000; // 总票数，用于计算进度条的百分比

// 设置 Cookie
function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

// 获取 Cookie
function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

// 删除 cookie
function deleteCookie(name) {
    document.cookie = name + '=; Max-Age=20;';  
}

// 检查用户是否登录
function checkLogin() {
    const loggedInUser = getCookie('loggedInUser');
    if (!loggedInUser) {
        window.location.href = 'login.html'; // 如果未登录，跳转到登录页面
        alert("请先登录才能投票。");
        return false;
    }
    return true;
}

// 检查用户是否已经投票
function hasVoted() {
    return getCookie('hasVoted') === 'true';
}

// 实时更新的动画函数
function animateVoteChange(voteId, candidateVoteId, newVotes, progressId) {
    const currentVotes = parseInt(document.getElementById(voteId).innerText.replace(/,/g, ''));
    const increment = (newVotes - currentVotes) / 35; // 每次递增的票数
    let current = currentVotes;

    let interval = setInterval(() => {
        current += increment;
        const roundedVotes = Math.round(current);

        // 更新票数显示
        document.getElementById(voteId).innerText = roundedVotes.toLocaleString();
        document.getElementById(candidateVoteId).innerText = roundedVotes.toLocaleString();

        // 更新进度条
        const percentage = Math.round((roundedVotes / totalVotes) * 100);
        updateProgressBar(progressId, percentage);

        // 停止动画
        if (roundedVotes === newVotes) {
            clearInterval(interval);
        }
    }, 1); // 每10ms更新一次
}

// 更新进度条
function updateProgressBar(id, percentage) {
    const progressBar = document.getElementById(id);
    progressBar.innerHTML = `<div style="width: ${percentage}%; background-color: #4CAF50; height: 100%;"></div>`;
}

// 投票功能
function vote(candidateId) {
    if (!checkLogin()) return; // 未登录用户不允许投票
    if (hasVoted()) {
        alert("您已经投票过了。");
        return; // 已投票用户不允许再次投票
    }

    // 更新票数
    let voteCountElement;
    if (candidateId === 'candidate1') {
        votes1 += 1;
        voteCountElement = 'votes1';
    } else if (candidateId === 'candidate2') {
        votes2 += 1;
        voteCountElement = 'votes2';
    }

    animateVoteChange(voteCountElement, candidateId === 'candidate1' ? 'candidateVotes1' : 'candidateVotes2', candidateId === 'candidate1' ? votes1 : votes2, candidateId === 'candidate1' ? 'progressBar1' : 'progressBar2');

    // 记录投票状态到 cookies
    setCookie('hasVoted', 'true', 30); // 设置 cookie，有效期 30 天
    disableVoting();
    alert("感谢您的投票！");
}

// 禁用投票按钮
function disableVoting() {
    document.getElementById('voteButton1').disabled = true;
    document.getElementById('voteButton2').disabled = true;
}

// 初始化投票系统
function initializeVoting() {
    if (hasVoted()) {
        disableVoting(); // 已投票用户禁用投票按钮
        alert("您已经投票过了。");
    } else {
        document.getElementById('voteButton1').addEventListener('click', () => vote('candidate1'));
        document.getElementById('voteButton2').addEventListener('click', () => vote('candidate2'));
    }
}

// 启动投票系统
initializeVoting();

// 点击按钮时增加票数
document.getElementById('voteButton1').addEventListener('click', () => {
    votes1 += 1; // 每点击一次增加一定数量的票
    animateVoteChange('votes1', 'candidateVotes1', votes1, 'progressBar1');
});

document.getElementById('voteButton2').addEventListener('click', () => {
    votes2 += 1;
    animateVoteChange('votes2', 'candidateVotes2', votes2, 'progressBar2');
});
