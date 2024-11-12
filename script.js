let votes1 = 413812; // 初始票数（方楚辰）
let votes2 = 71432108; // 初始票数（TRUMP）

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

// 检查用户是否登录
function checkLogin() {
    const loggedInUser = getCookie('loggedInUser');
    if (!loggedInUser) {
        alert("请先登录才能投票。");
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// 检查用户是否已经投票
function hasVoted() {
    return getCookie('hasVoted') === 'true';
}

// 实时更新动画函数
function animateVoteChange(voteId, candidateVoteId, newVotes, progressId) {
    const currentVotes = parseInt(document.getElementById(voteId).innerText.replace(/,/g, ''));
    const increment = (newVotes - currentVotes) / 35;
    let current = currentVotes;

    let interval = setInterval(() => {
        current += increment;
        const roundedVotes = Math.round(current);

        document.getElementById(voteId).innerText = roundedVotes.toLocaleString();
        document.getElementById(candidateVoteId).innerText = roundedVotes.toLocaleString();

        const totalCurrentVotes = votes1 + votes2;
        const percentage = Math.round((roundedVotes / totalCurrentVotes) * 100);
        updateProgressBar(progressId, percentage);

        if (roundedVotes === newVotes) {
            clearInterval(interval);
        }
    }, 10);
}

// 更新进度条
function updateProgressBar(id, percentage) {
    const progressBar = document.getElementById(id);
    progressBar.innerHTML = `<div style="width: ${percentage}%; background-color: #4CAF50; height: 100%;"></div>`;
}

// 投票功能
function vote(candidateId) {
    if (!checkLogin()) return;
    if (hasVoted()) {
        alert("您已经投票过了。");
        return;
    }

    if (candidateId === 'candidate1') {
        votes1 += 1;
        animateVoteChange('votes1', 'candidateVotes1', votes1, 'progressBar1');
    } else if (candidateId === 'candidate2') {
        votes2 += 1;
        animateVoteChange('votes2', 'candidateVotes2', votes2, 'progressBar2');
    }

    setCookie('hasVoted', 'true', 30);
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
        disableVoting();
        alert("您已经投票过了。");
    } else {
        document.getElementById('voteButton1').addEventListener('click', () => vote('candidate1'));
        document.getElementById('voteButton2').addEventListener('click', () => vote('candidate2'));
    }
}

// 设置点击跳转事件
document.addEventListener("DOMContentLoaded", function() {
    const voteLabels = document.querySelectorAll(".vote-label");

    voteLabels.forEach(function(voteLabel) {
        voteLabel.addEventListener("click", function() {
            const candidateId = voteLabel.getAttribute("data-candidate-id");
            window.location.href = `candidate_details.html?candidate_id=${candidateId}`;
        });
    });
});

// 启动投票系统
initializeVoting();
