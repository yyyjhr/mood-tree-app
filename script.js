// --- 1. AI Agent 的核心逻辑 (用JavaScript重写) ---
class TreeAgent {
    constructor() {
        this.health = 50;
        this.happiness = 50;
        this.water = 50;
        this.emotion_keywords = {
            'positive': ['开心', '快乐', '高兴', '哈哈', '爱', '喜欢', '棒', '不错', '完美', '顺利'],
            'negative': ['难过', '伤心', '失落', '郁闷', '烦', '讨厌', '糟糕', '失败', '哭', '累'],
            'neutral':  ['还行', '一般', '普通', '哦', '嗯', '知道了']
        };
        this.responses = {
            'positive': ["听到你这么说我真开心！感觉我又长高了一点呢！🌱", "太棒啦！你的快乐就是我的阳光！☀️", "为你感到高兴！我们一起加油！"],
            'negative': ["抱抱你，没关系的，一切都会好起来的。🌧️", "我在这里陪着你，把不开心都告诉我吧。", "别难过，你已经做得很棒了。休息一下，明天又是新的一天。"],
            'neutral': ["嗯嗯，我听着呢。", "原来是这样呀。", "谢谢你告诉我这些。"],
            'thirsty': ["我有点渴了...你能多陪我说说话吗？这就像给我浇水一样。💧", "感觉叶子有点蔫...需要你的关心来补充水分。"]
        };
    }

    analyzeEmotion(text) {
        for (const emotion in this.emotion_keywords) {
            for (const keyword of this.emotion_keywords[emotion]) {
                if (text.includes(keyword)) {
                    return emotion;
                }
            }
        }
        return 'neutral';
    }

    updateState(emotion) {
        if (emotion === 'positive') {
            this.happiness = Math.min(100, this.happiness + 10);
            this.health = Math.min(100, this.health + 5);
            this.water = Math.max(0, this.water - 5);
        } else if (emotion === 'negative') {
            this.happiness = Math.max(0, this.happiness - 5);
            this.water = Math.min(100, this.water + 10);
        } else {
            this.water = Math.max(0, this.water - 2);
        }
        if (this.water < 20) {
            this.health = Math.max(0, this.health - 5);
        }
    }

    getResponse(emotion) {
        if (this.water < 30 && Math.random() > 0.5) {
            const thirstyResponses = this.responses['thirsty'];
            return thirstyResponses[Math.floor(Math.random() * thirstyResponses.length)];
        }
        const emotionResponses = this.responses[emotion] || this.responses['neutral'];
        return emotionResponses[Math.floor(Math.random() * emotionResponses.length)];
    }

    getStatusText() {
        let status = `【小树苗状态】\n快乐值: ${this.happiness}/100 😊\n健康度: ${this.health}/100 ❤️\n水分值: ${this.water}/100 💧\n`;
        const avgStatus = (this.happiness + this.health + this.water) / 3;
        if (avgStatus > 70) status += "\n我长势喜人，感觉快要开花了！🌸";
        else if (avgStatus > 40) status += "\n我还在努力成长中...🌿";
        else status += "\n我需要你的关心...快枯萎了...🥀";
        return status;
    }
}

// --- 2. 图形界面 (GUI) 的逻辑 ---
document.addEventListener('DOMContentLoaded', () => {
    const agent = new TreeAgent();
    const statusDisplay = document.getElementById('status-display');
    const chatArea = document.getElementById('chat-area');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const treeImage = document.getElementById('tree-image');

    // 初始化显示
    updateTreeStatus();

    // 绑定发送按钮和回车键事件
    sendButton.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    });

    function sendMessage() {
        const userText = userInput.value.trim();
        if (!userText) return;

        const emotion = agent.analyzeEmotion(userText);
        agent.updateState(emotion);
        const response = agent.getResponse(emotion);

        updateDisplay(userText, response);
        updateTreeStatus();
        updateTreeImage();

        userInput.value = ''; // 清空输入框
    }

    function updateDisplay(userInput, response) {
        const userMsgDiv = document.createElement('div');
        userMsgDiv.className = 'user-message';
        userMsgDiv.textContent = `你: ${userInput}`;
        chatArea.appendChild(userMsgDiv);

        const treeMsgDiv = document.createElement('div');
        treeMsgDiv.className = 'tree-message';
        treeMsgDiv.textContent = `小树苗: ${response}`;
        chatArea.appendChild(treeMsgDiv);

        chatArea.scrollTop = chatArea.scrollHeight; // 滚动到底部
    }

    function updateTreeStatus() {
        statusDisplay.textContent = agent.getStatusText();
    }

    function updateTreeImage() {
        const health = agent.health;
        let imagePath = '';
        if (health < 20) imagePath = 'seed.png';
        else if (health < 40) imagePath = 'sprout.png';
        else if (health < 60) imagePath = 'young.png';
        else if (health < 85) imagePath = 'healthy.png';
        else imagePath = 'flowering.png';
        
        treeImage.src = imagePath;
    }
});
