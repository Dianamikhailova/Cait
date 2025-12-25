// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract GuessNumberGame {
    address public owner;
    uint256 public minBet = 0.0001 ether; // Минимальная ставка 0.0001 ETH
    uint256 public contractBalance;
    uint256 private nonce; // Для генерации случайных чисел
    
    struct Game {
        address player;
        uint256 betAmount;
        uint8 guessedNumber;
        uint8 secretNumber;
        bool played;
        bool won;
    }
    
    mapping(uint256 => Game) public games;
    uint256 public gameCount;
    
    event GameCreated(uint256 gameId, address player, uint256 betAmount);
    event GamePlayed(uint256 gameId, address player, bool won, uint256 prize);
    event FundsDeposited(address from, uint256 amount);
    event FundsWithdrawn(address to, uint256 amount);
    
    constructor() {
        owner = msg.sender;
    }
    
    // Модификатор только для владельца
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }
    
    // Игрок делает ставку и начинает игру
    function placeBetAndPlay(uint8 _guessedNumber) external payable {
        require(msg.value >= minBet, "Bet too low");
        require(_guessedNumber >= 1 && _guessedNumber <= 10, "Number must be 1-10");
        
        // Генерируем случайное число от 1 до 10
        uint8 secretNumber = generateRandomNumber();
        
        // Создаем игру
        uint256 gameId = gameCount++;
        games[gameId] = Game({
            player: msg.sender,
            betAmount: msg.value,
            guessedNumber: _guessedNumber,
            secretNumber: secretNumber,
            played: true,
            won: (_guessedNumber == secretNumber)
        });
        
        contractBalance += msg.value;
        
        // Если игрок выиграл - отправляем выигрыш
        if (_guessedNumber == secretNumber) {
            uint256 prize = msg.value * 2;
            
            // Проверяем, достаточно ли средств в контракте
            require(address(this).balance >= prize, "Not enough funds in contract");
            
            // Отправляем выигрыш
            (bool success, ) = payable(msg.sender).call{value: prize}("");
            require(success, "Transfer failed");
            
            contractBalance -= prize;
            
            emit GamePlayed(gameId, msg.sender, true, prize);
        } else {
            emit GamePlayed(gameId, msg.sender, false, 0);
        }
        
        emit GameCreated(gameId, msg.sender, msg.value);
    }
    
    // Генерация случайного числа (1-10)
    function generateRandomNumber() private returns (uint8) {
        // Используем block.timestamp, msg.sender и nonce для случайности
        uint256 random = uint256(keccak256(abi.encodePacked(
            block.timestamp,
            block.prevrandao,
            msg.sender,
            nonce
        )));
        nonce++;
        return uint8((random % 10) + 1);
    }
    
    // Пополнение банка игры владельцем
    function depositToBank() external payable onlyOwner {
        require(msg.value > 0, "Must send ETH");
        contractBalance += msg.value;
        emit FundsDeposited(msg.sender, msg.value);
    }
    
    // Вывод средств из банка игры (только владелец)
    function withdrawFromBank(uint256 amount) external onlyOwner {
        require(amount > 0, "Amount must be > 0");
        require(amount <= contractBalance, "Insufficient contract balance");
        require(amount <= address(this).balance, "Insufficient contract ETH");
        
        contractBalance -= amount;
        
        (bool success, ) = payable(owner).call{value: amount}("");
        require(success, "Transfer failed");
        
        emit FundsWithdrawn(owner, amount);
    }
    
    // Получить статистику игрока
    function getPlayerStats(address player) external view returns (
        uint256 totalGames,
        uint256 totalWins,
        uint256 totalBet
    ) {
        for (uint256 i = 0; i < gameCount; i++) {
            if (games[i].player == player) {
                totalGames++;
                totalBet += games[i].betAmount;
                if (games[i].won) {
                    totalWins++;
                }
            }
        }
    }
    
    // Получить историю игр игрока
    function getPlayerGames(address player) external view returns (uint256[] memory) {
        uint256 count = 0;
        
        // Считаем количество игр игрока
        for (uint256 i = 0; i < gameCount; i++) {
            if (games[i].player == player) {
                count++;
            }
        }
        
        // Собираем ID игр
        uint256[] memory playerGames = new uint256[](count);
        uint256 index = 0;
        
        for (uint256 i = 0; i < gameCount; i++) {
            if (games[i].player == player) {
                playerGames[index] = i;
                index++;
            }
        }
        
        return playerGames;
    }
    
    // Получить детали игры
    function getGameDetails(uint256 gameId) external view returns (
        address player,
        uint256 betAmount,
        uint8 guessedNumber,
        uint8 secretNumber,
        bool won
    ) {
        Game storage game = games[gameId];
        require(game.played, "Game does not exist");
        
        return (
            game.player,
            game.betAmount,
            game.guessedNumber,
            game.secretNumber,
            game.won
        );
    }
    
    // Получить баланс контракта (публичная функция)
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
    
    // Изменить минимальную ставку (только владелец)
    function setMinBet(uint256 _minBet) external onlyOwner {
        require(_minBet > 0, "Min bet must be > 0");
        minBet = _minBet;
    }
    
    // Получить выигрышные шансы (статический расчет)
    function getWinChance() external pure returns (uint256) {
        return 10; // 1 из 10 = 10%
    }
    
    // Fallback функция для получения ETH
    receive() external payable {
        contractBalance += msg.value;
        emit FundsDeposited(msg.sender, msg.value);
    }
}
