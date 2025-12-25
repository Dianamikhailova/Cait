// Конфигурация
const CONTRACT_ADDRESS = "0x4AE9d63860d63cf02Ac65E1C4756D008eA6B6817"; // ВСТАВЬТЕ АДРЕС ВАШЕГО КОНТРАКТА

// ABI контракта игры
const CONTRACT_ABI = [
    // Основные функции
    {
        "inputs": [{"internalType": "uint8", "name": "_guessedNumber", "type": "uint8"}],
        "name": "placeBetAndPlay",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "depositToBank",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "uint256", "name": "amount", "type": "uint256"}],
        "name": "withdrawFromBank",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    
    // View функции (чтение данных)
    {
        "inputs": [],
        "name": "owner",
        "outputs": [{"internalType": "address", "name": "", "type": "address"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "minBet",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "contractBalance",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "gameCount",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getContractBalance",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "address", "name": "player", "type": "address"}],
        "name": "getPlayerStats",
        "outputs": [
            {"internalType": "uint256", "name": "totalGames", "type": "uint256"},
            {"internalType": "uint256", "name": "totalWins", "type": "uint256"},
            {"internalType": "uint256", "name": "totalBet", "type": "uint256"}
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "address", "name": "player", "type": "address"}],
        "name": "getPlayerGames",
        "outputs": [{"internalType": "uint256[]", "name": "", "type": "uint256[]"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "uint256", "name": "gameId", "type": "uint256"}],
        "name": "getGameDetails",
        "outputs": [
            {"internalType": "address", "name": "player", "type": "address"},
            {"internalType": "uint256", "name": "betAmount", "type": "uint256"},
            {"internalType": "uint8", "name": "guessedNumber", "type": "uint8"},
            {"internalType": "uint8", "name": "secretNumber", "type": "uint8"},
            {"internalType": "bool", "name": "won", "type": "bool"}
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "uint256", "name": "_minBet", "type": "uint256"}],
        "name": "setMinBet",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getWinChance",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "pure",
        "type": "function"
    },
    
    // События
    {
        "anonymous": false,
        "inputs": [
            {"indexed": false, "internalType": "uint256", "name": "gameId", "type": "uint256"},
            {"indexed": false, "internalType": "address", "name": "player", "type": "address"},
            {"indexed": false, "internalType": "uint256", "name": "betAmount", "type": "uint256"}
        ],
        "name": "GameCreated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {"indexed": false, "internalType": "uint256", "name": "gameId", "type": "uint256"},
            {"indexed": false, "internalType": "address", "name": "player", "type": "address"},
            {"indexed": false, "internalType": "bool", "name": "won", "type": "bool"},
            {"indexed": false, "internalType": "uint256", "name": "prize", "type": "uint256"}
        ],
        "name": "GamePlayed",
        "type": "event"
    }
];

// Глобальные переменные
let provider = null;
let signer = null;
let contract = null;
let currentAccount = null;
let isOwner = false;

// DOM элементы
const connectBtn = document.getElementById('connectBtn');
const walletInfo = document.getElementById('walletInfo');
const walletAddress = document.getElementById('walletAddress');
const walletBalance = document.getElementById('walletBalance');
const contractBalance = document.getElementById('contractBalance');
const minBetElement = document.getElementById('minBet');
const betAmountInput = document.getElementById('betAmount');
const numberGrid = document.getElementById('numberGrid');
const selectedNumberInput = document.getElementById('selectedNumber');
const playBtn = document.getElementById('playBtn');
const playAmount = document.getElementById('playAmount');
const gameHistory = document.getElementById('gameHistory');
const totalGames = document.getElementById('totalGames');
const totalWins = document.getElementById('totalWins');
const winRate = document.getElementById('winRate');
const totalBet = document.getElementById('totalBet');
const adminPanel = document.getElementById('adminPanel');
const depositAmount = document.getElementById('depositAmount');
const depositBtn = document.getElementById('depositBtn');
const withdrawAmount = document.getElementById('withdrawAmount');
const withdrawBtn = document.getElementById('withdrawBtn');
const newMinBet = document.getElementById('newMinBet');
const updateMinBetBtn = document.getElementById('updateMinBetBtn');
const notification = document.getElementById('notification');
const resultModal = document.getElementById('resultModal');
const resultTitle = document.getElementById('resultTitle');
const resultIcon = document.getElementById('resultIcon');
const resultMessage = document.getElementById('resultMessage');
const resultPlayerNumber = document.getElementById('resultPlayerNumber');
const resultSecretNumber = document.getElementById('resultSecretNumber');
const resultBetAmount = document.getElementById('resultBetAmount');
const resultPrize = document.getElementById('resultPrize');
const resultPrizeContainer = document.getElementById('resultPrizeContainer');
const closeResultBtn = document.getElementById('closeResultBtn');

// Инициализация при загрузке страницы
window.addEventListener('DOMContentLoaded', async () => {
    console.log('🎮 Игра "Угадай число" загружается...');
    
    // Проверяем наличие MetaMask
    if (!window.ethereum) {
        showNotification('Установите MetaMask для игры!', 'error');
        connectBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Установите MetaMask';
        connectBtn.disabled = true;
        return;
    }

    // Создаем кнопки чисел 1-10
    createNumberButtons();
    
    // Настраиваем обновление суммы ставки
    betAmountInput.addEventListener('input', updatePlayAmount);
    
    // Проверяем подключение кошелька
    try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        console.log('Найдены аккаунты:', accounts);
        
        if (accounts.length > 0) {
            await connectWallet();
        }
    } catch (error) {
        console.error('Ошибка при проверке аккаунтов:', error);
    }

    // Слушаем изменения аккаунта
    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);
});

// Создание кнопок чисел
function createNumberButtons() {
    numberGrid.innerHTML = '';
    for (let i = 1; i <= 10; i++) {
        const button = document.createElement('button');
        button.className = 'number-btn';
        if (i === 1) button.classList.add('selected');
        button.textContent = i;
        button.dataset.number = i;
        
        button.addEventListener('click', () => {
            // Убираем выделение у всех кнопок
            document.querySelectorAll('.number-btn').forEach(btn => {
                btn.classList.remove('selected');
            });
            
            // Выделяем выбранную кнопку
            button.classList.add('selected');
            selectedNumberInput.value = i;
        });
        
        numberGrid.appendChild(button);
    }
}

// Обновление суммы на кнопке "Играть"
function updatePlayAmount() {
    const amount = parseFloat(betAmountInput.value) || 0.0001;
    playAmount.textContent = amount.toFixed(4);
}

// Подключение кошелька
connectBtn.onclick = async () => {
    if (!window.ethereum) {
        showNotification('Установите MetaMask!', 'error');
        return;
    }
    await connectWallet();
};

async function connectWallet() {
    try {
        console.log('🔗 Подключение кошелька...');
        
        provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        signer = await provider.getSigner();
        contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
        
        currentAccount = await signer.getAddress();
        console.log('✅ Аккаунт подключен:', currentAccount);
        
        // Обновляем UI кошелька
        connectBtn.innerHTML = '<i class="fas fa-check-circle"></i> Подключено';
        connectBtn.style.background = 'linear-gradient(45deg, #2ecc71, #27ae60)';
        walletAddress.textContent = `${currentAccount.slice(0, 6)}...${currentAccount.slice(-4)}`;
        walletInfo.classList.add('connected');
        
        // Получаем баланс кошелька
        await updateWalletBalance();
        
        // Проверяем, является ли пользователь владельцем
        await checkIfOwner();
        
        // Загружаем данные контракта
        await loadContractData();
        
        // Загружаем статистику игрока
        await loadPlayerStats();
        
        // Загружаем историю игр
        await loadGameHistory();
        
        showNotification('Кошелёк успешно подключен!', 'success');
        
    } catch (error) {
        console.error('❌ Ошибка подключения:', error);
        showNotification(`Ошибка подключения: ${error.message}`, 'error');
        connectBtn.innerHTML = '<i class="fas fa-wallet"></i> Подключить MetaMask';
        connectBtn.style.background = 'linear-gradient(45deg, #00d4ff, #0088ff)';
    }
}

// Обновление баланса кошелька
async function updateWalletBalance() {
    try {
        const balance = await provider.getBalance(currentAccount);
        const ethBalance = ethers.formatEther(balance);
        walletBalance.textContent = `${parseFloat(ethBalance).toFixed(4)} ETH`;
    } catch (error) {
        console.error('Ошибка получения баланса:', error);
        walletBalance.textContent = 'Ошибка';
    }
}

// Проверка, является ли пользователь владельцем
async function checkIfOwner() {
    try {
        const ownerAddress = await contract.owner();
        isOwner = ownerAddress.toLowerCase() === currentAccount.toLowerCase();
        
        if (isOwner) {
            console.log('👑 Пользователь является владельцем контракта');
            adminPanel.style.display = 'block';
            
            // Устанавливаем текущую минимальную ставку
            const currentMinBet = await contract.minBet();
            newMinBet.value = ethers.formatEther(currentMinBet);
        }
    } catch (error) {
        console.error('Ошибка проверки владельца:', error);
        isOwner = false;
    }
}

// Загрузка данных контракта
async function loadContractData() {
    try {
        // Получаем баланс контракта
        const balance = await contract.getContractBalance();
        const ethBalance = ethers.formatEther(balance);
        contractBalance.textContent = `${parseFloat(ethBalance).toFixed(4)} ETH`;
        
        // Получаем минимальную ставку
        const minBetValue = await contract.minBet();
        const minBetEth = ethers.formatEther(minBetValue);
        minBetElement.textContent = `${parseFloat(minBetEth).toFixed(4)} ETH`;
        
        // Устанавливаем минимальное значение в поле ввода
        betAmountInput.min = parseFloat(minBetEth);
        betAmountInput.value = parseFloat(minBetEth).toFixed(4);
        updatePlayAmount();
        
    } catch (error) {
        console.error('Ошибка загрузки данных контракта:', error);
        showNotification('Ошибка загрузки данных игры', 'error');
    }
}

// Загрузка статистики игрока
async function loadPlayerStats() {
    try {
        const stats = await contract.getPlayerStats(currentAccount);
        
        totalGames.textContent = Number(stats[0]);
        totalWins.textContent = Number(stats[1]);
        
        const totalGamesNum = Number(stats[0]);
        const totalWinsNum = Number(stats[1]);
        const winRateValue = totalGamesNum > 0 ? (totalWinsNum / totalGamesNum * 100).toFixed(1) : 0;
        winRate.textContent = `${winRateValue}%`;
        
        const totalBetValue = ethers.formatEther(stats[2]);
        totalBet.textContent = `${parseFloat(totalBetValue).toFixed(4)} ETH`;
        
    } catch (error) {
        console.error('Ошибка загрузки статистики:', error);
    }
}

// Загрузка истории игр
async function loadGameHistory() {
    try {
        const gameIds = await contract.getPlayerGames(currentAccount);
        gameHistory.innerHTML = '';
        
        if (gameIds.length === 0) {
            gameHistory.innerHTML = `
                <div class="empty-history">
                    <i class="fas fa-clock"></i>
                    <p>У вас еще нет сыгранных игр</p>
                    <p style="font-size: 0.9rem; margin-top: 10px; color: #888;">
                        Сделайте свою первую ставку!
                    </p>
                </div>
            `;
            return;
        }
        
        // Сортируем по ID (новые сверху)
        const sortedGameIds = [...gameIds].sort((a, b) => Number(b) - Number(a));
        
        // Показываем только последние 10 игр
        const recentGames = sortedGameIds.slice(0, 10);
        
        for (const gameId of recentGames) {
            try {
                const game = await contract.getGameDetails(gameId);
                
                const historyItem = document.createElement('div');
                historyItem.className = `history-item ${game.won ? 'win' : 'lose'}`;
                
                const ethAmount = ethers.formatEther(game.betAmount);
                
                historyItem.innerHTML = `
                    <div class="history-number">Игра #${Number(gameId) + 1}</div>
                    <div class="history-result ${game.won ? 'win' : 'lose'}">
                        <i class="fas fa-${game.won ? 'trophy' : 'times'}"></i>
                        <span>${game.won ? 'ПОБЕДА' : 'ПРОИГРЫШ'}</span>
                    </div>
                    <div class="history-amount">${parseFloat(ethAmount).toFixed(4)} ETH</div>
                `;
                
                gameHistory.appendChild(historyItem);
            } catch (error) {
                console.warn(`Ошибка загрузки игры ${gameId}:`, error);
            }
        }
        
    } catch (error) {
        console.error('Ошибка загрузки истории:', error);
        gameHistory.innerHTML = `
            <div class="empty-history">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Ошибка загрузки истории</p>
            </div>
        `;
    }
}

// Играть
playBtn.onclick = async () => {
    try {
        if (!contract) {
            showNotification('Подключите MetaMask!', 'error');
            return;
        }
        
        const betAmount = parseFloat(betAmountInput.value);
        const guessedNumber = parseInt(selectedNumberInput.value);
        
        // Валидация
        if (isNaN(betAmount) || betAmount <= 0) {
            showNotification('Введите корректную сумму ставки', 'error');
            return;
        }
        
        const minBetValue = await contract.minBet();
        const minBetEth = parseFloat(ethers.formatEther(minBetValue));
        
        if (betAmount < minBetEth) {
            showNotification(`Минимальная ставка: ${minBetEth} ETH`, 'error');
            return;
        }
        
        if (guessedNumber < 1 || guessedNumber > 10) {
            showNotification('Выберите число от 1 до 10', 'error');
            return;
        }
        
        // Проверяем баланс кошелька
        const walletBalance = await provider.getBalance(currentAccount);
        const requiredAmount = ethers.parseEther(betAmount.toString());
        
        if (walletBalance < requiredAmount) {
            showNotification('Недостаточно средств на кошельке', 'error');
            return;
        }
        
        // Показываем индикатор загрузки
        playBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Играем...';
        playBtn.disabled = true;
        
        console.log(`🎲 Играем: ставка ${betAmount} ETH, число ${guessedNumber}`);
        
        // Вызываем функцию контракта
        const tx = await contract.placeBetAndPlay(guessedNumber, {
            value: requiredAmount
        });
        
        showNotification('Транзакция отправлена...', 'info');
        
        // Ждем подтверждения
        const receipt = await tx.wait();
        console.log('Транзакция подтверждена:', receipt);
        
        // Ищем событие GamePlayed в логах
        const gamePlayedEvent = receipt.logs.find(log => {
            try {
                const parsedLog = contract.interface.parseLog(log);
                return parsedLog && parsedLog.name === 'GamePlayed';
            } catch {
                return false;
            }
        });
        
        if (gamePlayedEvent) {
            const parsedEvent = contract.interface.parseLog(gamePlayedEvent);
            const won = parsedEvent.args.won;
            const prize = parsedEvent.args.prize;
            
            // Показываем результат
            showGameResult(won, guessedNumber, betAmount, prize);
        } else {
            // Если не нашли событие, просто показываем успех
            showNotification('Игра завершена!', 'success');
        }
        
        // Обновляем данные
        await Promise.all([
            updateWalletBalance(),
            loadContractData(),
            loadPlayerStats(),
            loadGameHistory()
        ]);
        
    } catch (error) {
        console.error('❌ Ошибка игры:', error);
        
        if (error.message.includes('user rejected')) {
            showNotification('Вы отменили транзакцию', 'warning');
        } else if (error.message.includes('insufficient funds')) {
            showNotification('Недостаточно средств в контракте для выплаты', 'error');
        } else {
            showNotification(`Ошибка: ${error.message.substring(0, 100)}`, 'error');
        }
        
    } finally {
        playBtn.innerHTML = '<i class="fas fa-play-circle"></i> Играть';
        playBtn.disabled = false;
    }
};

// Показать результат игры
function showGameResult(won, guessedNumber, betAmount, prize) {
    // Устанавливаем данные
    if (won) {
        resultTitle.textContent = '🎉 ПОБЕДА!';
        resultIcon.innerHTML = '<i class="fas fa-trophy"></i>';
        resultIcon.className = 'result-icon win';
        resultMessage.textContent = 'Вы угадали число и выиграли!';
        resultPrize.textContent = `${parseFloat(ethers.formatEther(prize)).toFixed(4)} ETH`;
        resultPrizeContainer.style.display = 'flex';
    } else {
        resultTitle.textContent = '😢 ПРОИГРЫШ';
        resultIcon.innerHTML = '<i class="fas fa-times"></i>';
        resultIcon.className = 'result-icon lose';
        resultMessage.textContent = 'К сожалению, вы не угадали число';
        resultPrizeContainer.style.display = 'none';
    }
    
    // Получаем загаданное число (симулируем для демо)
    // В реальном приложении это число будет из события
    const secretNumber = Math.floor(Math.random() * 10) + 1;
    
    resultPlayerNumber.textContent = guessedNumber;
    resultSecretNumber.textContent = secretNumber;
    resultBetAmount.textContent = `${betAmount.toFixed(4)} ETH`;
    
    // Показываем модальное окно
    resultModal.style.display = 'flex';
}

// Пополнение банка (только владелец)
depositBtn.onclick = async () => {
    try {
        if (!isOwner) {
            showNotification('Только владелец может пополнять банк', 'error');
            return;
        }
        
        const amount = parseFloat(depositAmount.value);
        if (isNaN(amount) || amount <= 0) {
            showNotification('Введите корректную сумму', 'error');
            return;
        }
        
        depositBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Пополнение...';
        depositBtn.disabled = true;
        
        const tx = await contract.depositToBank({
            value: ethers.parseEther(amount.toString())
        });
        
        showNotification('Пополнение банка...', 'info');
        await tx.wait();
        
        showNotification('Банк успешно пополнен!', 'success');
        depositAmount.value = '';
        
        await loadContractData();
        await updateWalletBalance();
        
    } catch (error) {
        console.error('Ошибка пополнения банка:', error);
        showNotification(`Ошибка: ${error.message.substring(0, 100)}`, 'error');
    } finally {
        depositBtn.innerHTML = '<i class="fas fa-arrow-up"></i> Пополнить';
        depositBtn.disabled = false;
    }
};

// Вывод из банка (только владелец)
withdrawBtn.onclick = async () => {
    try {
        if (!isOwner) {
            showNotification('Только владелец может выводить средства', 'error');
            return;
        }
        
        const amount = parseFloat(withdrawAmount.value);
        if (isNaN(amount) || amount <= 0) {
            showNotification('Введите корректную сумму', 'error');
            return;
        }
        
        withdrawBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Вывод...';
        withdrawBtn.disabled = true;
        
        const tx = await contract.withdrawFromBank(
            ethers.parseEther(amount.toString())
        );
        
        showNotification('Вывод средств...', 'info');
        await tx.wait();
        
        showNotification('Средства успешно выведены!', 'success');
        withdrawAmount.value = '';
        
        await loadContractData();
        await updateWalletBalance();
        
    } catch (error) {
        console.error('Ошибка вывода средств:', error);
        showNotification(`Ошибка: ${error.message.substring(0, 100)}`, 'error');
    } finally {
        withdrawBtn.innerHTML = '<i class="fas fa-arrow-down"></i> Вывести';
        withdrawBtn.disabled = false;
    }
};

// Обновление минимальной ставки (только владелец)
updateMinBetBtn.onclick = async () => {
    try {
        if (!isOwner) {
            showNotification('Только владелец может менять ставки', 'error');
            return;
        }
        
        const amount = parseFloat(newMinBet.value);
        if (isNaN(amount) || amount <= 0) {
            showNotification('Введите корректную сумму', 'error');
            return;
        }
        
        if (amount < 0.0001) {
            showNotification('Минимальная ставка не может быть меньше 0.0001 ETH', 'error');
            return;
        }
        
        updateMinBetBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Обновление...';
        updateMinBetBtn.disabled = true;
        
        const tx = await contract.setMinBet(
            ethers.parseEther(amount.toString())
        );
        
        showNotification('Обновление минимальной ставки...', 'info');
        await tx.wait();
        
        showNotification('Минимальная ставка обновлена!', 'success');
        
        await loadContractData();
        
    } catch (error) {
        console.error('Ошибка обновления ставки:', error);
        showNotification(`Ошибка: ${error.message.substring(0, 100)}`, 'error');
    } finally {
        updateMinBetBtn.innerHTML = '<i class="fas fa-save"></i> Обновить';
        updateMinBetBtn.disabled = false;
    }
};

// Уведомления
function showNotification(message, type = 'info') {
    notification.textContent = message;
    notification.className = `notification show ${type}`;
    
    setTimeout(() => {
        notification.className = 'notification';
    }, 5000);
}

// Обработчики событий MetaMask
function handleAccountsChanged(accounts) {
    console.log('Аккаунт изменен:', accounts);
    if (accounts.length === 0) {
        // Пользователь отключил кошелёк
        disconnectWallet();
    } else {
        // Пользователь сменил аккаунт
        connectWallet();
    }
}

function handleChainChanged(chainId) {
    console.log('Сеть изменена:', chainId);
    showNotification('Сеть изменена, перезагрузка...', 'warning');
    setTimeout(() => {
        window.location.reload();
    }, 1000);
}

// Отключение кошелька
function disconnectWallet() {
    connectBtn.innerHTML = '<i class="fas fa-wallet"></i> Подключить MetaMask';
    connectBtn.style.background = 'linear-gradient(45deg, #00d4ff, #0088ff)';
    walletInfo.classList.remove('connected');
    currentAccount = null;
    contract = null;
    isOwner = false;
    adminPanel.style.display = 'none';
    
    showNotification('Кошелёк отключен', 'info');
}

// Закрытие модального окна
document.querySelector('.close-modal').onclick = () => {
    resultModal.style.display = 'none';
};

closeResultBtn.onclick = () => {
    resultModal.style.display = 'none';
};

// Закрытие по клику вне окна
window.onclick = (event) => {
    if (event.target === resultModal) {
        resultModal.style.display = 'none';
    }
};

// Автообновление каждые 30 секунд
setInterval(async () => {
    if (contract) {
        await loadContractData();
        await updateWalletBalance();
    }
}, 30000);

console.log('🎮 Игра "Угадай число" готова!');