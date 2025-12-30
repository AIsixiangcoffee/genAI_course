/**
 * ============================================
 * 生成式AI课程网站 - 主JavaScript文件
 * ============================================
 */

// ============================================
// 全局变量与配置
// ============================================
const CHAPTERS_COUNT = 11;
const STORAGE_KEY = 'genai_course_progress';

// ============================================
// 章节配置数据
// ============================================
const chaptersConfig = [
    { id: 'ch01', title: '生成式AI概述', completed: false },
    { id: 'ch02', title: '大语言模型原理', completed: false },
    { id: 'ch03', title: '模型训练', completed: false },
    { id: 'ch04', title: 'Transformer架构', completed: false },
    { id: 'ch05', title: '提示词工程', completed: false },
    { id: 'ch06', title: '动手实践', completed: false },
    { id: 'ch07', title: '函数调用（FC）', completed: false },
    { id: 'ch08', title: '检索增强生成（RAG）', completed: false },
    { id: 'ch09', title: 'AI智能体', completed: false },
    { id: 'ch10', title: 'AI安全', completed: false },
    { id: 'ch11', title: '小语言模型', completed: false }
];

// ============================================
// 工具函数
// ============================================

/**
 * 从localStorage获取学习进度
 */
function getProgress() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : {};
    } catch (e) {
        console.error('读取进度失败:', e);
        return {};
    }
}

/**
 * 保存学习进度到localStorage
 */
function saveProgress(progress) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (e) {
        console.error('保存进度失败:', e);
    }
}

/**
 * 标记章节为已完成
 */
function markChapterComplete(chapterId) {
    const progress = getProgress();
    progress[chapterId] = true;
    saveProgress(progress);
    updateNavigationUI();
}

/**
 * 检查章节是否已完成
 */
function isChapterCompleted(chapterId) {
    const progress = getProgress();
    return progress[chapterId] === true;
}

/**
 * 获取已完成章节数量
 */
function getCompletedCount() {
    const progress = getProgress();
    return Object.values(progress).filter(v => v === true).length;
}

/**
 * 记录最后阅读位置（用于从二级页面返回时定位）
 */
function saveScrollPosition(chapterId) {
    sessionStorage.setItem('lastChapter', chapterId);
}

/**
 * 滚动到指定章节
 */
function scrollToChapter(chapterId) {
    const element = document.getElementById(chapterId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        // 更新URL但不触发页面跳转
        history.replaceState(null, null, `#${chapterId}`);
    }
}

// ============================================
// UI更新函数
// ============================================

/**
 * 更新导航栏UI状态
 */
function updateNavigationUI() {
    const navLinks = document.querySelectorAll('.nav-link');
    const completedCount = getCompletedCount();
    const progressPercent = (completedCount / CHAPTERS_COUNT) * 100;

    // 更新进度条
    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.progress-text');
    if (progressFill) {
        progressFill.style.width = `${progressPercent}%`;
    }
    if (progressText) {
        progressText.textContent = `${completedCount}/${CHAPTERS_COUNT}`;
    }

    // 更新章节完成状态
    navLinks.forEach(link => {
        const chapterId = link.getAttribute('href').substring(1);
        if (isChapterCompleted(chapterId)) {
            link.classList.add('completed');
        } else {
            link.classList.remove('completed');
        }
    });
}

/**
 * 更新当前激活的导航项
 */
function updateActiveNav() {
    const sections = document.querySelectorAll('.chapter-section');
    const navLinks = document.querySelectorAll('.nav-link');

    let currentSection = '';

    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 150 && rect.bottom >= 150) {
            currentSection = section.id;
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// ============================================
// 导航栏控制
// ============================================

/**
 * 切换导航栏显示/隐藏
 */
function toggleNav() {
    const sideNav = document.querySelector('.side-nav');
    const mainContent = document.querySelector('.main-content');
    const showNavBtn = document.querySelector('.show-nav-btn');

    // 检查当前是否隐藏
    const isHidden = sideNav.classList.contains('hidden');

    if (isHidden) {
        // 显示导航栏
        sideNav.classList.remove('hidden');
        mainContent.classList.remove('expanded');
        showNavBtn.classList.remove('visible');
    } else {
        // 隐藏导航栏
        sideNav.classList.add('hidden');
        mainContent.classList.add('expanded');
        showNavBtn.classList.add('visible');
    }
}

/**
 * 初始化导航栏
 */
function initNavigation() {
    // 导航栏切换按钮
    const toggleBtn = document.querySelector('.toggle-nav-btn');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', toggleNav);
    }

    // 显示导航栏的浮动按钮
    const showNavBtn = document.querySelector('.show-nav-btn');
    if (showNavBtn) {
        showNavBtn.addEventListener('click', toggleNav);
    }

    // 点击导航链接时
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href').substring(1);
            saveScrollPosition(targetId);

            // 移动端点击后关闭导航栏
            if (window.innerWidth <= 768) {
                const sideNav = document.querySelector('.side-nav');
                sideNav.classList.remove('show');
            }
        });
    });

    // 滚动时更新激活状态
    window.addEventListener('scroll', updateActiveNav);
    updateActiveNav();

    // 初始化UI状态
    updateNavigationUI();
}

// ============================================
// 页面加载时的处理
// ============================================

/**
 * 处理页面加载时的滚动定位
 */
function handleInitialScroll() {
    // 检查URL中是否有hash
    const hash = window.location.hash.substring(1);

    // 如果没有hash，检查sessionStorage中是否有上次阅读位置
    const lastChapter = hash || sessionStorage.getItem('lastChapter');

    if (lastChapter) {
        setTimeout(() => {
            scrollToChapter(lastChapter);
        }, 300);
    }
}

/**
 * 处理"深入了解"按钮点击
 */
function initDeepDiveButtons() {
    const deepDiveBtns = document.querySelectorAll('.deep-dive-btn');

    deepDiveBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const href = btn.getAttribute('href');
            const chapterId = href.split('/')[1].replace('.html', '');

            // 点击"深入了解"时标记为已完成
            markChapterComplete(chapterId);
            saveScrollPosition(chapterId);
        });
    });
}

// ============================================
// 订阅表单处理
// ============================================

/**
 * 初始化订阅表单
 */
function initSubscribeForm() {
    const form = document.querySelector('.subscribe-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const emailInput = form.querySelector('.subscribe-input');
        const email = emailInput.value.trim();

        // 邮箱格式验证
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email) {
            alert('请输入邮箱地址');
            return;
        }

        if (!emailRegex.test(email)) {
            alert('请输入有效的邮箱地址');
            return;
        }

        // 模拟提交成功
        alert('感谢订阅！课程完成后证书将发送至您的邮箱。');
        emailInput.value = '';

        // 标记所有章节为已完成
        chaptersConfig.forEach(chapter => {
            markChapterComplete(chapter.id);
        });
    });
}

// ============================================
// 复制到剪贴板功能
// ============================================

/**
 * 复制文本到剪贴板
 */
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        // 降级方案
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            document.body.removeChild(textArea);
            return true;
        } catch (e) {
            document.body.removeChild(textArea);
            return false;
        }
    }
}

/**
 * 初始化复制按钮
 */
function initCopyButtons() {
    const copyBtns = document.querySelectorAll('.copy-btn');

    copyBtns.forEach(btn => {
        btn.addEventListener('click', async () => {
            const targetId = btn.getAttribute('data-copy-target');
            const targetElement = targetId
                ? document.getElementById(targetId)
                : btn.parentElement.nextElementSibling;

            if (!targetElement) return;

            const text = targetElement.textContent || targetElement.value;

            const success = await copyToClipboard(text);

            if (success) {
                const originalText = btn.textContent;
                btn.textContent = '已复制!';
                btn.classList.add('copied');

                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.classList.remove('copied');
                }, 2000);
            } else {
                alert('复制失败，请手动复制');
            }
        });
    });
}

// ============================================
// 提示词生成器（ch05二级页面）
// ============================================

/**
 * 初始化提示词生成器
 */
function initPromptGenerator() {
    const generateBtn = document.getElementById('generatePromptBtn');
    if (!generateBtn) return;

    generateBtn.addEventListener('click', () => {
        const role = document.getElementById('promptRole')?.value || 'AI助手';
        const task = document.getElementById('promptTask')?.value || '';
        const context = document.getElementById('promptContext')?.value || '';
        const format = document.getElementById('promptFormat')?.value || '文本';
        const tone = document.getElementById('promptTone')?.value || '专业';

        if (!task.trim()) {
            alert('请输入任务描述');
            return;
        }

        // 构建提示词
        let prompt = `# 角色设定\n你是一个${role}。\n\n`;

        if (context.trim()) {
            prompt += `# 上下文信息\n${context}\n\n`;
        }

        prompt += `# 任务要求\n${task}\n\n`;
        prompt += `# 输出要求\n- 格式：${format}\n- 语气：${tone}\n- 请确保回答准确、专业且易于理解。`;

        // 显示结果
        const previewElement = document.getElementById('promptPreview');
        if (previewElement) {
            previewElement.textContent = prompt;
            previewElement.style.display = 'block';
        }
    });
}

// ============================================
// 模拟AI对话功能
// ============================================

/**
 * 预设的AI回复库
 */
const aiResponses = {
    greeting: [
        '你好！我是AI助手，很高兴为你服务。有什么我可以帮助你的吗？',
        '你好！请问有什么问题我可以帮你解答？',
        '你好！我是你的AI助手，请随时向我提问。'
    ],
    weather: [
        '关于天气查询，在实际应用中，模型会通过函数调用（Function Calling）来获取实时天气数据。这就是我们课程中讲到的FC技术的实际应用场景！',
        '这是一个很好的问题！在实际部署时，AI会调用天气API来获取实时数据。这涉及到了函数调用的知识点。'
    ],
    default: [
        '这是一个很有趣的问题！在实际应用中，你可以通过调整提示词（Prompt）来获得更精准的回答。',
        '感谢你的提问！掌握好提示词工程是使用大模型的关键技能之一。',
        '这个问题值得深入思考。你可以在对应的"深入了解"页面中找到更多相关内容。',
        '很好的问题！通过RAG（检索增强生成）技术，可以让AI回答更加准确和有针对性。'
    ]
};

/**
 * 获取AI回复
 */
function getAIResponse(userMessage) {
    const msg = userMessage.toLowerCase();

    if (msg.includes('你好') || msg.includes('hi') || msg.includes('hello')) {
        return aiResponses.greeting[Math.floor(Math.random() * aiResponses.greeting.length)];
    }

    if (msg.includes('天气') || msg.includes('气温')) {
        return aiResponses.weather[Math.floor(Math.random() * aiResponses.weather.length)];
    }

    return aiResponses.default[Math.floor(Math.random() * aiResponses.default.length)];
}

/**
 * 初始化聊天演示
 */
function initChatDemo() {
    const chatContainer = document.querySelector('.chat-messages');
    const chatInput = document.querySelector('.chat-input');
    const sendBtn = document.querySelector('.send-btn');

    if (!chatContainer || !chatInput || !sendBtn) return;

    // 发送消息函数
    function sendMessage() {
        const message = chatInput.value.trim();
        if (!message) return;

        // 添加用户消息
        addMessage('user', message);
        chatInput.value = '';

        // 模拟AI思考延迟
        setTimeout(() => {
            const aiResponse = getAIResponse(message);
            addMessage('ai', aiResponse);
        }, 800);
    }

    // 添加消息到界面
    function addMessage(type, content) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${type}`;

        const avatar = document.createElement('div');
        avatar.className = 'chat-avatar';
        avatar.textContent = type === 'ai' ? '🤖' : '👤';

        const bubble = document.createElement('div');
        bubble.className = 'chat-bubble';
        bubble.textContent = content;

        messageDiv.appendChild(avatar);
        messageDiv.appendChild(bubble);
        chatContainer.appendChild(messageDiv);

        // 滚动到底部
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    // 绑定事件
    sendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // 初始欢迎消息
    setTimeout(() => {
        addMessage('ai', '你好！我是AI课程助手。你可以和我对话来体验大模型的交互效果，或者浏览课程内容了解更多知识！');
    }, 500);
}

// ============================================
// 小测验功能
// ============================================

/**
 * 测验题目数据
 */
const quizData = {
    ch05: {
        question: '在提示词工程中，以下哪个是提高输出质量的最佳实践？',
        options: [
            '使用模糊的描述让模型自由发挥',
            '将指令置于开头并用分隔符区分上下文',
            '使用负面指令告诉模型"不要做什么"',
            '一次性提供尽可能多的信息'
        ],
        correct: 1,
        explanation: '正确！将指令置于开头并用###或"""等分隔符区分上下文，可以帮助模型更快识别不同功能区域，避免语义混淆。这是OpenAI官方推荐的最佳实践之一。'
    },
    ch03: {
        question: '大模型训练的三个阶段按顺序是？',
        options: [
            '微调 → 预训练 → 强化学习',
            '预训练 → 微调 → 强化学习',
            '强化学习 → 预训练 → 微调',
            '预训练 → 强化学习 → 微调'
        ],
        correct: 1,
        explanation: '正确！大模型的训练分为三个阶段：预训练（让模型"听得懂人话"）→ 微调（让模型"能干专业事"）→ 强化学习（让模型"守住道德线"）。'
    }
};

/**
 * 初始化测验
 */
function initQuiz() {
    const quizContainers = document.querySelectorAll('.quiz-container');

    quizContainers.forEach(container => {
        const quizId = container.getAttribute('data-quiz-id');
        const quiz = quizData[quizId];

        if (!quiz) return;

        const submitBtn = container.querySelector('.submit-quiz-btn');
        const feedback = container.querySelector('.quiz-feedback');
        const options = container.querySelectorAll('.quiz-option');

        let selectedAnswer = null;

        // 选项点击事件
        options.forEach((option, index) => {
            option.addEventListener('click', () => {
                // 移除其他选项的选中状态
                options.forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
                selectedAnswer = index;

                // 更新radio选中状态
                const radio = option.querySelector('.quiz-radio');
                if (radio) radio.checked = true;
            });
        });

        // 提交按钮事件
        if (submitBtn) {
            submitBtn.addEventListener('click', () => {
                if (selectedAnswer === null) {
                    alert('请先选择一个答案');
                    return;
                }

                // 显示反馈
                feedback.classList.remove('correct', 'incorrect');
                feedback.classList.add('show');

                if (selectedAnswer === quiz.correct) {
                    feedback.classList.add('correct');
                    feedback.innerHTML = `
                        <strong>✓ 回答正确！</strong>
                        <p>${quiz.explanation}</p>
                    `;
                    options.forEach((opt, idx) => {
                        if (idx === quiz.correct) {
                            opt.classList.add('correct');
                        }
                    });
                    // 标记章节完成
                    const chapterId = quizId;
                    markChapterComplete(chapterId);
                } else {
                    feedback.classList.add('incorrect');
                    feedback.innerHTML = `
                        <strong>✗ 回答错误</strong>
                        <p>正确答案是：${quiz.options[quiz.correct]}</p>
                        <p>${quiz.explanation}</p>
                    `;
                    options.forEach((opt, idx) => {
                        if (idx === quiz.correct) {
                            opt.classList.add('correct');
                        } else if (idx === selectedAnswer) {
                            opt.classList.add('incorrect');
                        }
                    });
                }

                // 禁用提交按钮
                submitBtn.disabled = true;
                submitBtn.textContent = '已完成';
            });
        }
    });
}

// ============================================
// 社交分享功能
// ============================================

/**
 * 初始化社交分享按钮
 */
function initShareButtons() {
    const shareBtns = document.querySelectorAll('.share-btn');

    shareBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const shareType = btn.getAttribute('data-share-type');
            const url = encodeURIComponent(window.location.href);
            const title = encodeURIComponent(document.title);

            switch (shareType) {
                case 'weibo':
                    window.open(
                        `https://service.weibo.com/share/share.php?url=${url}&title=${title}`,
                        '_blank',
                        'width=600,height=500'
                    );
                    break;

                case 'wechat':
                    // 微信分享需要二维码，这里简化处理
                    alert('请截图分享到微信');
                    break;

                case 'copy':
                    copyToClipboard(window.location.href).then(success => {
                        if (success) {
                            alert('链接已复制到剪贴板');
                        } else {
                            alert('复制失败，请手动复制');
                        }
                    });
                    break;
            }
        });
    });
}

// ============================================
// 可折叠内容功能
// ============================================

/**
 * 初始化可折叠内容按钮
 */
function initExpandButtons() {
    const expandButtons = document.querySelectorAll('.expand-btn');

    expandButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            const content = document.getElementById(targetId);

            if (content) {
                const isExpanded = content.style.display !== 'none';

                if (isExpanded) {
                    // 折叠
                    content.style.display = 'none';
                    btn.classList.remove('expanded');
                } else {
                    // 展开
                    content.style.display = 'block';
                    btn.classList.add('expanded');
                }
            }
        });
    });
}

// ============================================
// 页面初始化
// ============================================

/**
 * DOM加载完成后初始化
 */
document.addEventListener('DOMContentLoaded', () => {
    // 初始化导航
    initNavigation();

    // 处理初始滚动
    handleInitialScroll();

    // 初始化深入了解按钮
    initDeepDiveButtons();

    // 初始化订阅表单
    initSubscribeForm();

    // 初始化复制按钮
    initCopyButtons();

    // 初始化提示词生成器（二级页面）
    initPromptGenerator();

    // 初始化聊天演示
    initChatDemo();

    // 初始化测验
    initQuiz();

    // 初始化可折叠内容按钮
    initExpandButtons();

    // 初始化社交分享
    initShareButtons();
});

/**
 * 页面卸载前保存滚动位置
 */
window.addEventListener('beforeunload', () => {
    const currentSection = document.querySelector('.chapter-section:not([style*="display: none"])');
    if (currentSection) {
        sessionStorage.setItem('lastChapter', currentSection.id);
    }
});

/**
 * 正确处理锚点跳转，确保滚动到章节顶部而非底部
 */
function handleAnchorScroll() {
    if (window.location.hash) {
        const hash = window.location.hash.substring(1); // 去掉#号
        const targetElement = document.getElementById(hash);

        if (targetElement) {
            // 等待页面完全加载后再滚动
            setTimeout(() => {
                const elementRect = targetElement.getBoundingClientRect();
                const absoluteElementTop = elementRect.top + window.pageYOffset;
                const middle = absoluteElementTop - 140; // 140px = header高度 + 额外空间

                window.scrollTo({
                    top: middle,
                    behavior: 'smooth'
                });
            }, 100);
        }
    }
}

// 页面加载时处理锚点
window.addEventListener('load', handleAnchorScroll);
// hash变化时也处理
window.addEventListener('hashchange', handleAnchorScroll);

