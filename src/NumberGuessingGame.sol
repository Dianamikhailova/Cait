// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract NumberGuessingGame {
    address public owner;
    uint256 public contractBalance;
    uint256 public constant MIN_BET = 0.0001 ether;
    uint256 public constant MAX_BET = 1 ether;
    
    struct Game {
        address player;
        uint256 betAmount;
        uint8 playerGuess;
        uint8 secretNumber;
        bool isFinished;
        bool isWon;
        uint256 timestamp;
    }
    
    mapping(uint256 => Game) public games;
    mapping(address => uint256[]) public playerGames;
    uint256 public gameCounter;
    
    event GameStarted(
        uint256 indexed gameId,
        address indexed player,
        uint256 betAmount,
        uint8 playerGuess
    );
    
    event GameFinished(
        uint256 indexed gameId,
        address indexed player,
        uint8 secretNumber,
        bool isWon,
        uint256 payout
    );
    
    event Withdrawal(address indexed recipient, uint256 amount);
    
    error OnlyOwner();
    error InvalidGuess();
    error BetTooLow();
    error BetTooHigh();
    error InsufficientFunds();
    error InvalidAmount();
    
    modifier onlyOwner() {
        _onlyOwner();
        _;
    }
    
    modifier validGuess(uint8 _guess) {
        _validGuess(_guess);
        _;
    }
    
    function _onlyOwner() internal view {
        if (msg.sender != owner) {
            revert OnlyOwner();
        }
    }
    
    function _validGuess(uint8 _guess) internal pure {
        if (_guess < 1 || _guess > 5) {
            revert InvalidGuess();
        }
    }
    
    constructor() payable {
        owner = msg.sender;
        if (msg.value > 0) {
            contractBalance += msg.value;
        }
    }
    
    function play(uint8 _guess) external payable validGuess(_guess) returns (uint256) {
        if (msg.value < MIN_BET) {
            revert BetTooLow();
        }
        
        if (msg.value > MAX_BET) {
            revert BetTooHigh();
        }
        
        // Генерация случайного числа
        uint8 secretNumber = generateRandomNumber(_guess, msg.sender, gameCounter);
        
        gameCounter++;
        uint256 gameId = gameCounter;
        
        games[gameId] = Game({
            player: msg.sender,
            betAmount: msg.value,
            playerGuess: _guess,
            secretNumber: secretNumber,
            isFinished: false,
            isWon: false,
            timestamp: block.timestamp
        });
        
        playerGames[msg.sender].push(gameId);
        contractBalance += msg.value;
        
        emit GameStarted(gameId, msg.sender, msg.value, _guess);
        
        // Проверка выигрыша
        bool isWon = (_guess == secretNumber);
        uint256 payout = 0;
        
        if (isWon) {
            payout = msg.value * 2;
            if (payout > address(this).balance) {
                revert InsufficientFunds();
            }
            payable(msg.sender).transfer(payout);
            contractBalance -= payout;
            games[gameId].isWon = true;
        }
        
        games[gameId].isFinished = true;
        
        emit GameFinished(gameId, msg.sender, secretNumber, isWon, payout);
        
        return gameId;
    }
    
    function generateRandomNumber(
        uint8 _guess, 
        address _player, 
        uint256 _nonce
    ) internal view returns (uint8) {
        // Более безопасный способ генерации случайного числа
        bytes32 hash = keccak256(
            abi.encodePacked(
                block.timestamp,
                block.prevrandao,
                _player,
                _nonce,
                _guess
            )
        );
        return uint8(uint256(hash) % 5) + 1;
    }
    
    function getPlayerGames(address _player) external view returns (uint256[] memory) {
        return playerGames[_player];
    }
    
    function getGameDetails(uint256 _gameId) external view returns (
        address player,
        uint256 betAmount,
        uint8 playerGuess,
        uint8 secretNumber,
        bool isFinished,
        bool isWon,
        uint256 timestamp
    ) {
        Game memory game = games[_gameId];
        return (
            game.player,
            game.betAmount,
            game.playerGuess,
            game.secretNumber,
            game.isFinished,
            game.isWon,
            game.timestamp
        );
    }
    
    function withdrawFunds(uint256 _amount) external onlyOwner {
        if (_amount > address(this).balance) {
            revert InsufficientFunds();
        }
        
        if (_amount == 0) {
            revert InvalidAmount();
        }
        
        contractBalance -= _amount;
        payable(owner).transfer(_amount);
        
        emit Withdrawal(owner, _amount);
    }
    
    function fundContract() external payable {
        contractBalance += msg.value;
    }
    
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
    
    function getMinBet() external pure returns (uint256) {
        return MIN_BET;
    }
    
    function getMaxBet() external pure returns (uint256) {
        return MAX_BET;
    }
    
    receive() external payable {
        contractBalance += msg.value;
    }
    
    fallback() external payable {
        contractBalance += msg.value;
    }
}
