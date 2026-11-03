/**
 * 《紫微斗数全书》— 核心精选
 *
 * 公版（明代罗洪先编）
 * 是紫微斗数最系统的古籍，强调宫位关系与四化，全本约 10 万字。
 */

import type { Book } from '../types';

export const ziWeiQuanShu: Book = {
  title: '紫微斗数全书',
  titleVi: 'Tử Vi Đẩu Số Toàn Thư',
  slug: 'quanshu',
  dynasty: '明代',
  dynastyVi: 'Đời Minh',
  author: '罗洪先 编',
  authorVi: 'La Hồng Tiên biên soạn',
  intro: '紫微斗数最系统的古籍，强调十二宫与四化的关系。是清代以降紫微学者的主要教材。',
  introVi: 'Sách cổ có hệ thống nhất về Tử Vi Đẩu Số, chú trọng mối quan hệ giữa mười hai cung và Tứ Hoá. Từ đời Thanh trở đi, đây là sách học chính của người nghiên cứu Tử Vi.',
  wordCount: 100000,
  chapters: [
    {
      title: '十二宫论·命宫',
      titleVi: 'Mười hai cung · Cung Mệnh',
      subtitle: '看命之根本',
      subtitleVi: 'Gốc rễ của việc xem số',
      paragraphs: [
        {
          id: 'qs-1-1',
          idx: 1,
          text: '命宫者，一身之根本，万事之枢纽。命宫定，则一生格局定。看命宫先看主星，次看辅煞，再看四化与三方四正之会照。',
          vi: 'Cung Mệnh là gốc rễ của một đời người, là then chốt của mọi việc. Cung Mệnh định thì cách cục cả đời định. Xem cung Mệnh trước xem chính tinh, sau xem phụ tinh và sát tinh, rồi xem Tứ Hoá và sự hội chiếu của Tam Phương Tứ Chính.',
        },
        {
          id: 'qs-1-2',
          idx: 2,
          text: '命宫主星庙旺，主先天优势，做事事半功倍；落陷则主先天劣势，但反主大成——落陷之人有"不甘"二字推动，反能爆发出庙旺命格做不到的逆袭。',
          vi: 'Chính tinh ở cung Mệnh Miếu Vượng, chủ có lợi thế bẩm sinh, làm việc ít công mà nhiều kết quả; Hãm địa thì chủ bất lợi bẩm sinh, nhưng ngược lại có thể làm nên việc lớn: người có sao Hãm được hai chữ “không cam” thúc đẩy, lại có thể bứt phá mà người có sao Miếu Vượng không làm được.',
        },
        {
          id: 'qs-1-3',
          idx: 3,
          text: '命宫见六吉星（左辅右弼文昌文曲天魁天钺），主一生贵人不绝；命宫见六煞星（擎羊陀罗火星铃星地空地劫），主多波折磨砺，但若能忍过，反成大器。',
          vi: 'Cung Mệnh gặp sáu cát tinh (Tả Phù, Hữu Bật, Văn Xương, Văn Khúc, Thiên Khôi, Thiên Việt), chủ cả đời không thiếu quý nhân; cung Mệnh gặp sáu sát tinh (Kình Dương, Đà La, Hoả Tinh, Linh Tinh, Địa Không, Địa Kiếp), chủ nhiều sóng gió, gian truân, nhưng nếu chịu đựng vượt qua được thì ngược lại thành người tài lớn.',
        },
      ],
    },
    {
      title: '十二宫论·财帛宫',
      titleVi: 'Mười hai cung · Cung Tài Bạch',
      subtitle: '财源所在',
      subtitleVi: 'Nguồn tiền đến từ đâu',
      paragraphs: [
        {
          id: 'qs-2-1',
          idx: 1,
          text: '财帛宫主一生之财源、收入、理财方式。财帛宫主星不同，赚钱方式各异：紫微在财主官财，武曲在财主商财，太阴在财主田宅财，巨门在财主口才财。',
          vi: 'Cung Tài Bạch chủ nguồn tiền, thu nhập và cách quản lý tiền trong cả đời. Chính tinh ở cung Tài Bạch khác nhau thì cách kiếm tiền khác nhau: Tử Vi ở Tài Bạch chủ tiền từ chức quyền, Vũ Khúc ở Tài Bạch chủ tiền từ buôn bán, Thái Âm ở Tài Bạch chủ tiền từ nhà đất, Cự Môn ở Tài Bạch chủ tiền từ tài ăn nói.',
        },
        {
          id: 'qs-2-2',
          idx: 2,
          text: '财帛宫化禄入命，主财源广进；财帛宫化忌，主财来财去；财帛宫见禄存，主稳定积累；财帛宫遇空劫，主财耗虚名。',
          vi: 'Cung Tài Bạch Hoá Lộc nhập cung Mệnh, chủ tiền vào từ nhiều nguồn; cung Tài Bạch có Hoá Kỵ, chủ tiền đến rồi đi; cung Tài Bạch có Lộc Tồn, chủ tích luỹ ổn định; cung Tài Bạch gặp Địa Không, Địa Kiếp, chủ hao tiền, danh hão.',
        },
      ],
    },
    {
      title: '十二宫论·官禄宫',
      titleVi: 'Mười hai cung · Cung Quan Lộc',
      subtitle: '事业之根',
      subtitleVi: 'Gốc rễ của sự nghiệp',
      paragraphs: [
        {
          id: 'qs-3-1',
          idx: 1,
          text: '官禄宫主事业、地位、社会成就。官禄宫主星不同，事业方向各异：紫微在官宜大平台高位，太阳在官宜公务名声，武曲在官宜金融实业，廉贞在官宜文武兼备。',
          vi: 'Cung Quan Lộc chủ sự nghiệp, địa vị, thành tựu ngoài xã hội. Chính tinh ở cung Quan Lộc khác nhau thì hướng sự nghiệp khác nhau: Tử Vi ở Quan Lộc nên ở nơi lớn, chức cao; Thái Dương ở Quan Lộc nên làm việc công, có danh tiếng; Vũ Khúc ở Quan Lộc nên làm tài chính, sản xuất kinh doanh; Liêm Trinh ở Quan Lộc thì văn võ đều được.',
        },
        {
          id: 'qs-3-2',
          idx: 2,
          text: '官禄宫化权入命，主能独当一面；化禄入官，主财从职业来；化忌入官，主职场波折。',
          vi: 'Cung Quan Lộc Hoá Quyền nhập cung Mệnh, chủ một mình gánh vác được; Hoá Lộc vào cung Quan Lộc, chủ tiền đến từ nghề nghiệp; Hoá Kỵ vào cung Quan Lộc, chủ công việc nhiều trắc trở.',
        },
      ],
    },
    {
      title: '十二宫论·夫妻宫',
      titleVi: 'Mười hai cung · Cung Phu Thê',
      subtitle: '配偶气场',
      subtitleVi: 'Khí chất của vợ chồng',
      paragraphs: [
        {
          id: 'qs-4-1',
          idx: 1,
          text: '夫妻宫主配偶气质、婚姻状态。夫妻宫紫微主配偶端庄威权，宜迟婚；夫妻宫贪狼主配偶多情，桃花重；夫妻宫天梁主配偶成熟稳重，年长。',
          vi: 'Cung Phu Thê chủ khí chất của vợ hoặc chồng và tình trạng hôn nhân. Cung Phu Thê có Tử Vi chủ vợ chồng đoan trang, có uy, nên lấy muộn; cung Phu Thê có Tham Lang chủ vợ chồng đa tình, đào hoa nặng; cung Phu Thê có Thiên Lương chủ vợ chồng chín chắn, điềm đạm, lớn tuổi hơn.',
        },
        {
          id: 'qs-4-2',
          idx: 2,
          text: '夫妻宫化忌冲命，主婚姻多波折。夫妻宫见六煞，需特别注意感情之磨砺。夫妻宫见六吉，主配偶贵人。',
          vi: 'Cung Phu Thê Hoá Kỵ xung cung Mệnh, chủ hôn nhân nhiều sóng gió. Cung Phu Thê gặp sáu sát tinh, cần đặc biệt lưu ý những thử thách trong tình cảm. Cung Phu Thê gặp sáu cát tinh, chủ vợ hoặc chồng là quý nhân của mình.',
        },
      ],
    },
    {
      title: '四化论',
      titleVi: 'Bàn về Tứ Hoá',
      subtitle: '化禄化权化科化忌',
      subtitleVi: 'Hoá Lộc, Hoá Quyền, Hoá Khoa, Hoá Kỵ',
      paragraphs: [
        {
          id: 'qs-5-1',
          idx: 1,
          text: '四化为命盘之精华——化禄主财、化权主势、化科主名、化忌主病。四化所在宫位，决定一生重大事件之节点。',
          vi: 'Tứ Hoá là tinh hoa của lá số: Hoá Lộc chủ tiền, Hoá Quyền chủ thế lực, Hoá Khoa chủ danh tiếng, Hoá Kỵ chủ bệnh. Tứ Hoá nằm ở cung nào thì quyết định những mốc sự kiện lớn trong đời ở đó.',
        },
        {
          id: 'qs-5-2',
          idx: 2,
          text: '生年四化为本命四化，永远固定；倪师强调四化星不动，只看大限流年走到何处。北派飞星派之自化、宫干飞化、来因宫等，倪师不主张使用。',
          vi: 'Tứ Hoá năm sinh là Tứ Hoá của bản mệnh, cố định mãi mãi; thầy Nghê nhấn mạnh sao Tứ Hoá không di chuyển, chỉ xem Đại Hạn, Lưu Niên đi đến đâu. Các phép Tự Hoá, phi hoá theo can cung, cung Lai Nhân… của phái Phi Tinh (Bắc phái), thầy Nghê không chủ trương dùng.',
        },
        {
          id: 'qs-5-3',
          idx: 3,
          text: '化禄入命三方四正：财源稳定，缘分广，能力可变现。化禄入夫妻：婚姻甜蜜。化禄入官禄：事业财源相应。',
          vi: 'Hoá Lộc vào Tam Phương Tứ Chính của cung Mệnh: nguồn tiền ổn định, duyên rộng, năng lực biến được thành tiền. Hoá Lộc vào cung Phu Thê: hôn nhân ngọt ngào. Hoá Lộc vào cung Quan Lộc: sự nghiệp và tiền bạc đi cùng nhau.',
        },
        {
          id: 'qs-5-4',
          idx: 4,
          text: '化忌入命三方四正：一生有深刻功课，宜面对而非逃避。化忌入夫妻：婚姻多磨砺。化忌入官禄：事业多波折，但磨练后反成专业人才。',
          vi: 'Hoá Kỵ vào Tam Phương Tứ Chính của cung Mệnh: cả đời có bài học sâu sắc, nên đối mặt chứ đừng trốn tránh. Hoá Kỵ vào cung Phu Thê: hôn nhân nhiều thử thách. Hoá Kỵ vào cung Quan Lộc: sự nghiệp nhiều trắc trở, nhưng rèn luyện xong lại thành người giỏi chuyên môn.',
        },
      ],
    },
    {
      title: '机月同梁格',
      titleVi: 'Cách Cơ Nguyệt Đồng Lương',
      subtitle: '稳定累积之命',
      subtitleVi: 'Số ổn định, tích luỹ dần',
      paragraphs: [
        {
          id: 'qs-6-1',
          idx: 1,
          text: '天机太阴天同天梁四星齐入命三方四正，称机月同梁格。文质彬彬、聪慧善谋，最适合公职、学术、文艺、医疗、服务等需稳定累积的行业。',
          vi: 'Bốn sao Thiên Cơ, Thái Âm, Thiên Đồng, Thiên Lương cùng vào Tam Phương Tứ Chính của cung Mệnh, gọi là cách Cơ Nguyệt Đồng Lương. Người nho nhã, thông minh, giỏi mưu tính, hợp nhất với các nghề cần ổn định và tích luỹ dần như công chức, học thuật, văn nghệ, y tế, dịch vụ.',
        },
        {
          id: 'qs-6-2',
          idx: 2,
          text: '机月同梁作吏人——古云此格者宜担任公职、行政文书工作，安稳一生。再会昌曲化科，主名声远播。最忌煞星过多，则反主多变难安。',
          vi: '“Cơ Nguyệt Đồng Lương tác lại nhân” (Cơ Nguyệt Đồng Lương làm quan lại): người xưa nói người có cách này nên làm công chức, làm việc hành chính, giấy tờ, cả đời yên ổn. Nếu gặp thêm Văn Xương, Văn Khúc, Hoá Khoa thì danh tiếng vang xa. Kỵ nhất là sát tinh quá nhiều, khi đó ngược lại chủ hay thay đổi, khó yên.',
        },
      ],
    },
    {
      title: '双禄朝垣格',
      titleVi: 'Cách Song Lộc Triều Viên',
      subtitle: '富比陶朱',
      subtitleVi: 'Giàu như Đào Chu Công',
      paragraphs: [
        {
          id: 'qs-7-1',
          idx: 1,
          text: '化禄与禄存同会命宫三方四正，称双禄朝垣格。古云"双禄朝垣，富比陶朱"，主一生不愁财，多有正财横财兼得。',
          vi: 'Hoá Lộc và Lộc Tồn cùng hội ở Tam Phương Tứ Chính của cung Mệnh, gọi là cách Song Lộc Triều Viên. Người xưa nói “Song Lộc Triều Viên, giàu như Đào Chu Công”, chủ cả đời không lo về tiền, thường có cả chính tài lẫn tiền bất ngờ.',
        },
        {
          id: 'qs-7-2',
          idx: 2,
          text: '双禄朝垣最忌空劫——空劫一冲，则双禄成虚名。需见左辅右弼或文昌文曲，方为正格。',
          vi: 'Song Lộc Triều Viên kỵ nhất Địa Không, Địa Kiếp: Không Kiếp xung vào thì hai sao Lộc thành danh hão. Cần gặp Tả Phù, Hữu Bật hoặc Văn Xương, Văn Khúc mới là chính cách.',
        },
      ],
    },
  ],
};
