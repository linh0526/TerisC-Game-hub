const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const GameSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: String,
  description: String,
  thumbnail: String,
  guide: mongoose.Schema.Types.Mixed
});

const Game = mongoose.model('Game', GameSchema);

const games = [
  {
    id: 'tictactoe',
    title: 'Tic Tac Toe',
    description: 'Trò chơi trí tuệ cổ điển dành cho 2 người.',
    thumbnail: 'https://papergames.io/vi/assets/games/gomoku/thumbnail.png',
    guide: [    
      {
        title: 'Luật chơi',
        content: 'Hai người chơi có thể thi đấu với nhau trên bàn 3 × 3 trong Tic Tac Toe. Một người chơi chọn O, người còn lại sẽ chọn X. Người đầu tiên tạo dãy ba ký tự giống nhau (hoặc X hoặc O) theo chiều ngang, chiều dọc hoặc đường chéo sẽ là người chiến thắng.'
      },
      {
        title: 'Trò chơi hai người',
        content: 'Trên Papergames.io, bạn có thể chơi Tic Tac Toe trực tuyến với một người chơi khác. Ngoài ra, bạn có thể tạo một bàn đấu riêng và không hề có giới hạn về số ván đấu.'
      },
      {
        title: 'Tạo giải đấu với nhiều người chơi',
        content: 'Bạn có thể tạo một giải đấu riêng và thách thức những người chơi với một bảng xếp hạng. Đây là một tính năng độc đáo của trò chơi này trên Papergames.io. Giải đấu có thể có sự tham gia của nhiều người chơi và nhiều bàn đấu nếu bạn muốn. Sẽ có hệ thống tự động kết nối các người chơi trực tuyến với nhau. Khi người chơi thắng ván đấu sẽ được +15 điểm, trong trường hợp hòa thì +4 điểm cho người chơi nhanh nhất, và +2 điểm cho người chơi chậm nhất. Người chơi thua sẽ không kiếm được điểm nào.'
      },
      {
        title: 'Chiến thuật để giành chiến thắng',
        content: 'Tic Tac Toe là một trò chơi thuộc thể loại zero-sum game (tổng bằng 0), điều này có nghĩa rằng chiến thắng của một người sẽ dẫn đến sự thất bại của người khác. Trong trường hợp cả hai đều chơi một cách thận trọng và có chiến thuật, trò chơi sẽ kết thúc với tỷ số hòa. Dưới đây là những chiến lược và chiến thuật hữu ích nhất khi bạn chơi Tic Tac Toe.',
        subsections: [
          {
            title: 'Khi có nước đi đầu',
            content: 'Cho quân X đầu tiên ở một góc. Trong ví dụ này, người chơi có Xs sẽ chơi trước. Khi bạn có nước đi đầu tiên, hãy đặt X vào một góc. Nếu đối thủ không đi ở ô trung tâm, bạn chắc chắn sẽ giành chiến thắng! Quân X thứ hai đặt ở trung tâm để buộc đối thủ chặn bạn. Sau đó đặt X thứ ba vào một trong các ô bên cạnh ô đã đặt X đầu tiên. Bằng cách này, bạn đã có một nước đi kép và đối thủ sẽ chỉ có thể chặn một trong số đó. Chúc mừng, bạn đã chiến thắng!'
          },
          {
            title: 'Nếu đối thủ chọn đi ở ô trung tâm',
            content: 'Khi đối thủ chọn ô trung tâm làm nước đi đầu tiên, bạn vẫn có cơ hội chiến thắng nếu đối thủ mắc lỗi. Nếu không, ván đấu sẽ kết thúc với tỷ số hòa. Đáp lại bằng cách đặt X thứ hai vào ô đối diện theo đường chéo từ ô bạn đã thực hiện bước đi đầu tiên. Vị trí khi đó sẽ là X-O-X. Nếu đối thủ chọn một trong những ô trong góc khác, bạn chắc chắn sẽ giành chiến thắng. Bạn chỉ cần đi vào ô trống trong góc cuối cùng và cơ hội chiến thắng đã nhân đôi!'
          },
          {
            title: 'Thắng khi đối thủ không theo sát tâm',
            content: 'Nếu đối thủ di chuyển O ở nơi nào khác ngoài tâm, chiến thắng của bạn sẽ được đảm bảo. Đáp lại bằng cách đặt X thứ hai vào một góc trong khi để một ô trống bên cạnh X đầu tiên của bạn.'
          },
          {
            title: 'Khi đối thủ có nước đi đầu',
            content: 'Đối thủ thực hiện nước đi đầu tiên bằng cách đặt O vào ô trong góc. Trong trường hợp này khi bạn không phải là người chơi bắt đầu, bạn vẫn có cơ hội kết thúc với tỷ số hòa nếu không phạm lỗi. Khi đối thủ đặt O vào ô trong góc đầu tiên, bạn hãy đặt X vào ô trung tâm. Nếu đối thủ đặt O thứ hai vào một trong các ô trong góc còn lại, đừng đặt X của bạn vào một góc, thay vào đó hãy đặt vào các ô biên. Điều này sẽ buộc đối thủ phải phản ứng chứ không phải tấn công. Sau đó, bạn có thể mong đợi một chiến thắng nếu đối thủ phạm sai lầm, nếu không trò chơi sẽ kết thúc với tỷ số hòa.'
          },
          {
            title: 'Khi đối thủ bắt đầu trò chơi bằng cách đặt nước đi ở biên',
            content: 'Nếu đối thủ là một người chơi thiếu kinh nghiệm thì rất có thể họ sẽ bắt đầu nước đi đầu tiên ở biên. Đặt X của bạn vào ô trung tâm ngay lập tức. Nếu đối thủ phản ứng bằng cách đặt O thứ hai đối diện với nước đi đầu tiên của họ (tạo ra O-X-O), thì bạn hãy đặt X thứ hai vào một góc. Nếu đối thủ đặt O thứ ba vào một ô chặn đường thắng của bạn (tạo ra đường chéo X-X-O), thì bạn hãy di chuyển X vào một ô trong góc khác, điều này cho phép bạn chặn đối thủ và tạo ra đường chéo kép. Chúc mừng, bạn đã chiến thắng!'
          }
        ]
      }
    ]
  },  
  {
    id: 'minesweeper',
    title: 'Dò mìn',
    description: 'Trò chơi tìm mìn cổ điển (Single Player).',
    thumbnail: 'https://lh3.googleusercontent.com/gg-dl/AOI_d_9nU_O7UKM-zfdv4gnfpJK_irXILGpigEWz83C8XAuRhY8bRZtUp_DT6Y3JPw9WnHZ90J5YTRtpCDe0Ycb06deO3JI-PBsr8jfw_F7QH5Qygar1QK8hgwj3PklOYHsa9cyNeNmh3wE1z5gnpyAYcmOPB9_KPFkyZFzl18RSLeqNCTHTNg=s1024-rj',
    guide: [
      {
        "title": "Ghi nhớ các công thức trong trò chơi",
        "content": "Sử dụng các con số hiển thị để xác định số lượng mìn xung quanh ô vuông. Người mới cần thời gian để ghi nhớ các mẫu số này, nhưng khi thành thạo, bạn sẽ nhận diện vị trí mìn gần như tức thì mà không cần suy nghĩ nhiều."
      },
      {
        "title": "Cắm cờ một cách khôn ngoan và hiệu quả",
        "content": "Sử dụng thao tác 'double click' (nhấn cả chuột trái và phải cùng lúc) vào một con số khi đã cắm đủ cờ xung quanh nó. Hệ thống sẽ tự động mở các ô an toàn còn lại, giúp tiết kiệm tối đa thời gian xử lý."
      },
      {
        "title": "Không được đoán bừa",
        "content": "Khi gặp tình huống không chắc chắn, hãy áp dụng nguyên tắc: 'Luôn bấm vào ô vuông có khả năng dính mìn thấp nhất'. Đừng chọn ngẫu nhiên mà hãy kết hợp logic cùng một chút linh cảm để bảo toàn ván đấu."
      },
      {
        "title": "Tham gia vào các câu lạc bộ Minesweeper",
        "content": "Tham gia cộng đồng để học hỏi thủ thuật và theo dõi các kỷ lục. Lưu ý, để ghi danh vào bảng xếp hạng thế giới, bạn cần hoàn thành các cấp độ khó trong thời gian dưới 100 giây."
      },
      { 
        "title": "Công thức cơ bản 1-1 và 1-2",
        "content": "Công thức 1-1: Hai số 1 đứng cạnh nhau ở rìa thì ô thứ 3 an toàn. Công thức 1-2: Số 2 đứng cạnh số 1 ở rìa thì ô thứ 3 (phía bên số 2) chắc chắn có bom. Đây là nền tảng để giải mọi thế cờ phức tạp."
      },
      {
        "title": "Chiến thuật Guessing (Đoán)",
        "content": "Khi vào đường cùng, hãy quyết định thật nhanh để tránh lãng phí thời gian. Đảm bảo đã quét sạch tất cả các ô an toàn có thể giải bằng logic trước khi thực hiện một cú nhấp chuột mang tính may rủi."
      }
    ]
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.REACT_APP_MONGODB_URI);
    console.log('Connected to MongoDB');
    
    await Game.deleteMany({});
    await Game.insertMany(games);
    
    console.log('Database seeded successfully');
    process.exit();
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
}

seed();
