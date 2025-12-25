class NewYearGame {
    constructor() {
        this.web3 = null;
        this.contract = null;
        this.account = null;
        this.contractAddress = '0x12524ca20685305c61E1A496277B17fB63eF6C27';
        this.contractABI = [
            {
                "inputs": [],
                "stateMutability": "nonpayable",
                "type": "constructor"
            },
            {
                "inputs": [],
                "name": "BetTooHigh",
                "type": "error"
            },
            {
                "inputs": [],
                "name": "BetTooLow",
                "type": "error"
            },
            {
                "inputs": [],
                "name": "InsufficientFunds",
                "type": "error"
            },
            {
                "inputs": [],
                "name": "InvalidAmount",
                "type": "error"
            },
            {
                "inputs": [],
                "name": "InvalidGuess",
                "type": "error"
            },
            {
                "inputs": [],
                "name": "OnlyOwner",
                "type": "error"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "internalType": "uint256",
                        "name": "gameId",
                        "type": "uint256"
                    },
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "player",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint8",
                        "name": "secretNumber",
                        "type": "uint8"
                    },
                    {
                        "indexed": false,
                        "internalType": "bool",
                        "name": "isWon",
                        "type": "bool"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "payout",
                        "type": "uint256"
                    }
                ],
                "name": "GameFinished",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "internalType": "uint256",
                        "name": "gameId",
                        "type": "uint256"
                    },
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "player",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "betAmount",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint8",
                        "name": "playerGuess",
                        "type": "uint8"
                    }
                ],
                "name": "GameStarted",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "recipient",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    }
                ],
                "name": "Withdrawal",
                "type": "event"
            },
            {
                "stateMutability": "payable",
                "type": "fallback"
            },
            {
                "inputs": [],
                "name": "MIN_BET",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "contractBalance",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "fundContract",
                "outputs": [],
                "stateMutability": "payable",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "gameCounter",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "name": "games",
                "outputs": [
                    {
                        "internalType": "address",
                        "name": "player",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "betAmount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint8",
                        "name": "playerGuess",
                        "type": "uint8"
                    },
                    {
                        "internalType": "uint8",
                        "name": "secretNumber",
                        "type": "uint8"
                    },
                    {
                        "internalType": "bool",
                        "name": "isFinished",
                        "type": "bool"
                    },
                    {
                        "internalType": "bool",
                        "name": "isWon",
                        "type": "bool"
                    },
                    {
                        "internalType": "uint256",
                        "name": "timestamp",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "getContractBalance",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "_gameId",
                        "type": "uint256"
                    }
                ],
                "name": "getGameDetails",
                "outputs": [
                    {
                        "internalType": "address",
                        "name": "player",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "betAmount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint8",
                        "name": "playerGuess",
                        "type": "uint8"
                    },
                    {
                        "internalType": "uint8",
                        "name": "secretNumber",
                        "type": "uint8"
                    },
                    {
                        "internalType": "bool",
                        "name": "isFinished",
                        "type": "bool"
                    },
                    {
                        "internalType": "bool",
                        "name": "isWon",
                        "type": "bool"
                    },
                    {
                        "internalType": "uint256",
                        "name": "timestamp",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "getMinBet",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "_player",
                        "type": "address"
                    }
                ],
                "name": "getPlayerGames",
                "outputs": [
                    {
                        "internalType": "uint256[]",
                        "name": "",
                        "type": "uint256[]"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "owner",
                "outputs": [
                    {
                        "internalType": "address",
                        "name": "",
                        "type": "address"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "",
                        "type": "address"
                    }
                ],
                "name": "playerGames",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint8",
                        "name": "_guess",
                        "type": "uint8"
                    }
                ],
                "name": "play",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "payable",
                "type": "function"
            },
            {
                "stateMutability": "payable",
                "type": "receive"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "_amount",
                        "type": "uint256"
                    }
                ],
                "name": "withdrawFunds",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            }
        ];
        
        this.init();
    }

    async init() {
        await this.loadWeb3();
        await this.loadContract();
        this.setupEventListeners();
        this.updatePotentialWin();
    }

    async loadWeb3() {
        if (window.ethereum) {
            this.web3 = new Web3(window.ethereum);
            try {
                const accounts = await window.ethereum.request({ 
                    method: 'eth_requestAccounts' 
                });
                if (accounts.length > 0) {
                    await this.updateWalletInfo();
                }
            } catch (error) {
                console.log("User denied account access");
            }
        } else if (window.web3) {
            this.web3 = new Web3(window.web3.currentProvider);
        } else {
            this.showMetaMaskAlert();
            return;
        }
        
        if (window.ethereum) {
            window.ethereum.on('accountsChanged', (accounts) => {
                this.account = accounts[0];
                this.updateWalletInfo();
                this.loadGameHistory();
            });
            
            window.ethereum.on('chainChanged', () => {
                window.location.reload();
            });
        }
    }

    showMetaMaskAlert() {
        alert('Пожалуйста, установите MetaMask для использования этого приложения!');
    }

    async loadContract() {
        try {
            if (!this.web3) return;
            
            this.contract = new this.web3.eth.Contract(
                this.contractABI, 
                this.contractAddress
            );
            
            await this.updateContractInfo();
        } catch (error) {
            console.error('Error loading contract:', error);
        }
    }

    async updateWalletInfo() {
        if (!this.web3 || !this.contract) return;

        try {
            const accounts = await this.web3.eth.getAccounts();
            if (accounts.length === 0) {
                document.getElementById('connectWallet').style.display = 'flex';
                document.getElementById('walletInfo').style.display = 'none';
                document.getElementById('playButton').disabled = true;
                return;
            }

            this.account = accounts[0];
            document.getElementById('connectWallet').style.display = 'none';
            document.getElementById('walletInfo').style.display = 'flex';
            
            const address = this.account.substring(0, 6) + '...' + this.account.substring(38);
            document.getElementById('walletAddress').textContent = address;
            
            const balance = await this.web3.eth.getBalance(this.account);
            const ethBalance = this.web3.utils.fromWei(balance, 'ether');
            document.getElementById('walletBalance').textContent = 
                parseFloat(ethBalance).toFixed(4) + ' ETH';
            
            document.getElementById('playButton').disabled = false;
            
            await this.updateContractInfo();
            await this.loadGameHistory();
            
        } catch (error) {
            console.error('Error updating wallet info:', error);
        }
    }

    async updateContractInfo() {
        try {
            if (!this.contract) return;
            
            const contractBalance = await this.contract.methods.getContractBalance().call();
            const minBet = await this.contract.methods.getMinBet().call();
            
            document.getElementById('contractBalance').textContent = 
                parseFloat(this.web3.utils.fromWei(contractBalance, 'ether')).toFixed(4) + ' ETH';
            document.getElementById('minBet').textContent = 
                this.web3.utils.fromWei(minBet, 'ether') + ' ETH';
            
            this.updatePotentialWin();
        } catch (error) {
            console.error('Error updating contract info:', error);
        }
    }

    async playGame(number) {
        if (!this.account || !this.contract) {
            alert('Пожалуйста, подключите кошелек сначала');
            return;
        }

        const betAmount = document.getElementById('betAmount').value;
        const betWei = this.web3.utils.toWei(betAmount, 'ether');

        try {
            // Получаем минимальную ставку
            const minBet = await this.contract.methods.getMinBet().call();
            const minBetEth = this.web3.utils.fromWei(minBet, 'ether');

            if (parseFloat(betAmount) < parseFloat(minBetEth)) {
                alert(`Минимальная ставка: ${minBetEth} ETH`);
                return;
            }

            if (parseFloat(betAmount) > 1) {
                alert('Максимальная ставка: 1 ETH');
                return;
            }

            // Проверяем баланс пользователя
            const userBalance = await this.web3.eth.getBalance(this.account);
            if (parseFloat(this.web3.utils.fromWei(userBalance, 'ether')) < parseFloat(betAmount)) {
                alert('Недостаточно средств на кошельке');
                return;
            }

            // Блокируем кнопку
            const playButton = document.getElementById('playButton');
            playButton.disabled = true;
            playButton.innerHTML = '<span class="btn-icon">⏳</span> Обработка...';

            // Отправляем транзакцию
            const result = await this.contract.methods.play(number).send({
                from: this.account,
                value: betWei,
                gas: 300000
            });

            // Обрабатываем результат
            if (result.events.GameFinished) {
                const event = result.events.GameFinished.returnValues;
                const isWon = event.isWon;
                const secretNumber = event.secretNumber;
                
                this.showGameResult(
                    number,
                    secretNumber,
                    isWon,
                    this.web3.utils.fromWei(event.payout, 'ether')
                );
                
                // Показываем эффект "С Новым Годом" если выиграл
                if (isWon) {
                    this.showNewYearEffect();
                }
            }

            // Обновляем информацию
            await this.updateContractInfo();
            await this.updateWalletInfo();
            await this.loadGameHistory();

        } catch (error) {
            console.error('Error playing game:', error);
            let errorMessage = 'Произошла ошибка';
            
            if (error.code === 4001) {
                errorMessage = 'Транзакция отменена пользователем';
            } else if (error.message.includes('BetTooLow')) {
                errorMessage = 'Ставка слишком низкая';
            } else if (error.message.includes('BetTooHigh')) {
                errorMessage = 'Ставка слишком высокая';
            } else if (error.message.includes('InsufficientFunds')) {
                errorMessage = 'Недостаточно средств в контракте';
            }
            
            alert(errorMessage);
        } finally {
            // Разблокируем кнопку
            const playButton = document.getElementById('playButton');
            playButton.disabled = false;
            playButton.innerHTML = '<span class="btn-icon">🎮</span> Играть!';
        }
    }

    showGameResult(playerGuess, secretNumber, isWon, payout) {
        document.getElementById('playerGuessResult').textContent = playerGuess;
        document.getElementById('secretNumberResult').textContent = secretNumber;
        
        if (isWon) {
            document.getElementById('gameStatus').textContent = '🎉 Победа!';
            document.getElementById('gameStatus').style.color = '#4CAF50';
        } else {
            document.getElementById('gameStatus').textContent = '😢 Поражение';
            document.getElementById('gameStatus').style.color = '#F44336';
        }
        
        document.getElementById('payoutAmount').textContent = payout + ' ETH';
        document.getElementById('gameResult').style.display = 'block';
    }

    showNewYearEffect() {
        const effect = document.getElementById('newYearEffect');
        effect.style.display = 'flex';
        
        // Автоматически скрываем через 10 секунд
        setTimeout(() => {
            this.hideNewYearEffect();
        }, 10000);
    }

    hideNewYearEffect() {
        document.getElementById('newYearEffect').style.display = 'none';
    }

    updatePotentialWin() {
        const betAmount = document.getElementById('betAmount').value;
        const potentialWin = parseFloat(betAmount) * 2;
        document.getElementById('potentialWin').textContent = 
            potentialWin.toFixed(4) + ' ETH';
    }

    async loadGameHistory() {
        if (!this.account || !this.contract) return;

        try {
            const gameIds = await this.contract.methods.getPlayerGames(this.account).call();
            const historyContainer = document.getElementById('gamesHistory');
            historyContainer.innerHTML = '';

            // Покажем последние 5 игр
            const recentGames = gameIds.slice(-5).reverse();

            if (recentGames.length === 0) {
                historyContainer.innerHTML = '<p class="empty-history">Игр пока нет</p>';
                return;
            }

            for (const gameId of recentGames) {
                const game = await this.contract.methods.getGameDetails(gameId).call();
                
                const gameItem = document.createElement('div');
                gameItem.className = `game-item ${game.isWon ? 'won' : 'lost'}`;
                
                const date = new Date(game.timestamp * 1000);
                const timeString = date.toLocaleTimeString('ru-RU', {
                    hour: '2-digit',
                    minute: '2-digit'
                });
                
                gameItem.innerHTML = `
                    <div class="game-item-header">
                        <span class="game-id">Игра #${gameId}</span>
                        <span class="game-time">${timeString}</span>
                    </div>
                    <div class="game-details">
                        <p>Ставка: ${this.web3.utils.fromWei(game.betAmount, 'ether')} ETH</p>
                        <p>Ваше число: ${game.playerGuess}</p>
                        <p>Загаданное: ${game.secretNumber}</p>
                        <p>Результат: <strong>${game.isWon ? 'Победа 🎉' : 'Поражение 😢'}</strong></p>
                    </div>
                `;
                
                historyContainer.appendChild(gameItem);
            }
        } catch (error) {
            console.error('Error loading game history:', error);
        }
    }

    setupEventListeners() {
        // Подключение кошелька
        document.getElementById('connectWallet').addEventListener('click', async () => {
            if (window.ethereum) {
                try {
                    await window.ethereum.request({ method: 'eth_requestAccounts' });
                    await this.updateWalletInfo();
                } catch (error) {
                    console.log("User denied account access");
                }
            } else {
                this.showMetaMaskAlert();
            }
        });

        // Кнопки выбора числа
        document.querySelectorAll('.number-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                document.querySelectorAll('.number-btn').forEach(btn => {
                    btn.classList.remove('selected');
                });
                e.target.classList.add('selected');
                
                const number = parseInt(e.target.dataset.number);
                document.getElementById('selectedNumber').textContent = number;
                document.getElementById('selectedNumber').dataset.value = number;
            });
        });

        // Кнопка игры
        document.getElementById('playButton').addEventListener('click', async () => {
            const selectedNumber = document.getElementById('selectedNumber').dataset.value;
            if (!selectedNumber) {
                alert('Пожалуйста, выберите число сначала!');
                return;
            }
            
            await this.playGame(parseInt(selectedNumber));
        });

        // Поле ввода ставки
        const betInput = document.getElementById('betAmount');
        betInput.addEventListener('input', (e) => {
            let value = parseFloat(e.target.value);
            if (isNaN(value)) value = 0.0001;
            if (value < 0.0001) value = 0.0001;
            if (value > 1) value = 1;
            e.target.value = value.toFixed(4);
            this.updatePotentialWin();
        });

        // Кнопки управления ставкой
        document.querySelectorAll('[data-action="decrease"]').forEach(btn => {
            btn.addEventListener('click', () => {
                const input = document.getElementById('betAmount');
                let value = parseFloat(input.value) - 0.0001;
                if (value < 0.0001) value = 0.0001;
                input.value = value.toFixed(4);
                this.updatePotentialWin();
            });
        });

        document.querySelectorAll('[data-action="increase"]').forEach(btn => {
            btn.addEventListener('click', () => {
                const input = document.getElementById('betAmount');
                let value = parseFloat(input.value) + 0.0001;
                if (value > 1) value = 1;
                input.value = value.toFixed(4);
                this.updatePotentialWin();
            });
        });

        // Кнопка закрытия эффекта
        document.getElementById('closeEffect').addEventListener('click', () => {
            this.hideNewYearEffect();
        });
    }
}

// Инициализация при загрузке страницы
window.addEventListener('load', () => {
    window.gameApp = new NewYearGame();
});
