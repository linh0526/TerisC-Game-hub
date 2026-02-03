const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const GameSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: String,
  description: String,
  thumbnail: String,
  rule: String,
  guide: mongoose.Schema.Types.Mixed
});

const Game = mongoose.model('Game', GameSchema);

const games = [
  {
    id: 'tictactoe',
    title: 'Tic Tac Toe',
    description: 'Trò chơi trí tuệ cổ điển dành cho 2 người.',
    thumbnail: 'https://papergames.io/vi/assets/games/gomoku/thumbnail.png',
    rule: 'Nối 3 quân cờ cùng hàng để giành chiến thắng.',
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
    id: 'memory',
    title: 'Trò chơi trí nhớ',
    description: 'Tìm các cặp thẻ giống nhau để ghi điểm.',
    thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&q=80',
    rule: 'Tìm toàn bộ các cặp hình giống nhau.',
    guide: []
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
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
